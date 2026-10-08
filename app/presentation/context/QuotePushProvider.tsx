import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import type { PropsWithChildren } from 'react';

import { Alert, AppState, Platform } from 'react-native';

import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging';

import { AuthContext } from './AuthContext';
import { QuotePushEventService } from '../../infrastructure';

import type { QuotePushEvent } from '../../domain';

interface QuotePushContextValue {
  pendingEvent: QuotePushEvent | null;
  latestEvent: QuotePushEvent | null;
  requestOpenQuote: (event: QuotePushEvent) => Promise<void>;
  completeOpenQuote: (eventId: string) => Promise<void>;
}

const QuotePushContext = createContext<QuotePushContextValue | undefined>(
  undefined,
);

// Conserva el resultado si el proveedor vuelve a montarse.
let initialNotificationPromise:
  | ReturnType<typeof getInitialNotification>
  | undefined;

export function useQuotePush(): QuotePushContextValue {
  const context = useContext(QuotePushContext);

  if (!context) {
    throw new Error('useQuotePush must be used inside QuotePushProvider');
  }

  return context;
}

export function QuotePushProvider({ children }: PropsWithChildren) {
  const { status, user } = useContext(AuthContext);

  const [pendingEvent, setPendingEvent] = useState<QuotePushEvent | null>(null);

  const [latestEvent, setLatestEvent] = useState<QuotePushEvent | null>(null);

  const authRef = useRef({
    status,
    userId: user?.id,
  });

  useLayoutEffect(() => {
    authRef.current = {
      status,
      userId: user?.id,
    };
  }, [status, user?.id]);

  const requestOpenQuote = useCallback(
    async (event: QuotePushEvent): Promise<void> => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        const saved = await QuotePushEventService.savePendingEvent(event);

        if (saved) {
          setPendingEvent(current =>
            current?.eventId === saved.eventId ? current : saved,
          );
        }
      } catch {
        console.warn('Unable to persist the pending notification.');

        // Conservamos la intención durante esta ejecución.
        setPendingEvent(event);
      }
    },
    [],
  );

  const completeOpenQuote = useCallback(
    async (eventId: string): Promise<void> => {
      try {
        await QuotePushEventService.markHandled(eventId);
      } catch {
        console.warn('Unable to persist the handled notification.');
      }

      setPendingEvent(current =>
        current?.eventId === eventId ? null : current,
      );
    },
    [],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    let active = true;

    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeOpened: (() => void) | undefined;

    const foregroundSeen = new Set<string>();

    void QuotePushEventService.getPendingEvent()
      .then(event => {
        if (active && event) {
          setPendingEvent(current => current ?? event);
        }
      })
      .catch(() => {
        console.warn('Unable to restore the pending notification.');
      });

    try {
      const messaging = getMessaging();

      unsubscribeMessage = onMessage(messaging, async remoteMessage => {
        const event = QuotePushEventService.parse(remoteMessage.data);

        if (
          !active ||
          !event ||
          AppState.currentState !== 'active' ||
          authRef.current.status !== 'authenticated' ||
          authRef.current.userId !== event.userId ||
          foregroundSeen.has(event.eventId)
        ) {
          return;
        }

        foregroundSeen.add(event.eventId);

        if (foregroundSeen.size > 200) {
          const oldest = foregroundSeen.values().next().value;

          if (oldest) {
            foregroundSeen.delete(oldest);
          }
        }

        let shouldShow = true;

        try {
          shouldShow = await QuotePushEventService.claimForegroundEvent(
            event.eventId,
          );
        } catch {
          console.warn('Unable to persist notification deduplication.');
        }

        if (
          !active ||
          !shouldShow ||
          AppState.currentState !== 'active' ||
          authRef.current.status !== 'authenticated' ||
          authRef.current.userId !== event.userId
        ) {
          return;
        }

        setLatestEvent(event);

        const appointment = event.type === 'QUOTE_APPOINTMENT_ASSIGNED';

        Alert.alert(
          appointment ? 'Appointment scheduled' : 'Your quote is ready',
          appointment
            ? 'Your appointment has been scheduled. Review the date and time in your quote.'
            : 'The final price has been assigned to your quote.',
          [
            {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'View quote',
              onPress: () => {
                void requestOpenQuote(event);
              },
            },
          ],
          { cancelable: true },
        );
      });

      unsubscribeOpened = onNotificationOpenedApp(messaging, remoteMessage => {
        const event = QuotePushEventService.parse(remoteMessage.data);

        if (active && event) {
          void requestOpenQuote(event);
        }
      });

      initialNotificationPromise ??= getInitialNotification(messaging);

      void initialNotificationPromise
        .then(remoteMessage => {
          if (!active || !remoteMessage) {
            return;
          }

          const event = QuotePushEventService.parse(remoteMessage.data);

          if (event) {
            void requestOpenQuote(event);
          }
        })
        .catch(() => {
          console.warn('Unable to read the initial notification.');
        });
    } catch {
      console.warn('Unable to initialize notification listeners.');
    }

    return () => {
      active = false;
      unsubscribeMessage?.();
      unsubscribeOpened?.();
    };
  }, [requestOpenQuote]);

  return (
    <QuotePushContext.Provider
      value={{
        pendingEvent,
        latestEvent,
        requestOpenQuote,
        completeOpenQuote,
      }}
    >
      {children}
    </QuotePushContext.Provider>
  );
}
