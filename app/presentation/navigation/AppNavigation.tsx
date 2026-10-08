import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';

import type { RootStackParamList } from '../../domain';
import { AuthContext } from '../context/AuthContext';
import { useQuotePush } from '../context/QuotePushProvider';
import RootNavigator from './RootNavigator';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const AppNavigation = () => {
  const { status, user } = useContext(AuthContext);
  const { pendingEvent, completeOpenQuote } = useQuotePush();

  const [navigationRevision, setNavigationRevision] = useState(0);

  const requestedEventRef = useRef<string | null>(null);
  const finishingEventRef = useRef<string | null>(null);

  const handleNavigationChange = useCallback(() => {
    setNavigationRevision(current => current + 1);
  }, []);

  useEffect(() => {
    if (!pendingEvent) {
      requestedEventRef.current = null;
      return;
    }

    if (status !== 'authenticated' || !user?.id) {
      return;
    }

    const event = pendingEvent;

    const finishEvent = () => {
      if (finishingEventRef.current === event.eventId) {
        return;
      }

      finishingEventRef.current = event.eventId;

      void completeOpenQuote(event.eventId)
        .catch(() => {
          console.warn('Unable to complete quote notification opening.');
        })
        .finally(() => {
          if (finishingEventRef.current === event.eventId) {
            finishingEventRef.current = null;
          }
        });
    };

    if (event.userId !== user.id) {
      finishEvent();
      return;
    }

    if (!navigationRef.isReady()) {
      return;
    }

    const rootState = navigationRef.getRootState();
    const activeRootRoute = rootState?.routes[rootState.index];

    if (activeRootRoute?.name !== 'App') {
      return;
    }

    const currentRoute = navigationRef.getCurrentRoute();
    const currentParams = currentRoute?.params as
      | { quoteId?: string; eventId?: string }
      | undefined;

    const destinationIsOpen =
      currentRoute?.name === 'MembershipHome' &&
      currentParams?.quoteId === event.quoteId &&
      currentParams?.eventId === event.eventId;

    if (destinationIsOpen) {
      finishEvent();
      return;
    }

    if (requestedEventRef.current === event.eventId) {
      return;
    }

    requestedEventRef.current = event.eventId;

    try {
      navigationRef.navigate('App', {
        screen: 'ProfileTab',
        params: {
          screen: 'MembershipHome',
          initial: false,
          params: {
            quoteId: event.quoteId,
            eventId: event.eventId,
          },
        },
      });
    } catch {
      requestedEventRef.current = null;
      console.warn('Unable to open the quote notification destination.');
    }
  }, [status, user?.id, pendingEvent, completeOpenQuote, navigationRevision]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationChange}
      onStateChange={handleNavigationChange}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};
