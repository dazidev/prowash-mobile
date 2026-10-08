import * as Keychain from 'react-native-keychain';

import type { QuotePushEvent } from '../../../domain';

const STORAGE_KEY = 'prowash_quote_push_events';
const MAX_EVENT_IDS = 200;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface StoredPushEvents {
  foregroundEventIds: string[];
  handledEventIds: string[];
  pendingEvent: QuotePushEvent | null;
}

export class QuotePushEventService {
  private static queue: Promise<void> = Promise.resolve();

  static parse(data: unknown): QuotePushEvent | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const value = data as Record<string, unknown>;

    const { eventId, userId, quoteId, type } = value;

    if (
      typeof eventId !== 'string' ||
      typeof userId !== 'string' ||
      typeof quoteId !== 'string' ||
      !UUID_PATTERN.test(eventId) ||
      !UUID_PATTERN.test(userId) ||
      !UUID_PATTERN.test(quoteId)
    ) {
      return null;
    }

    if (
      type !== 'QUOTE_APPOINTMENT_ASSIGNED' &&
      type !== 'QUOTE_FINAL_PRICE_ASSIGNED'
    ) {
      return null;
    }

    return {
      eventId,
      userId,
      quoteId,
      type,
    };
  }

  static getPendingEvent(): Promise<QuotePushEvent | null> {
    return this.run(async () => {
      const state = await this.read();

      return state.pendingEvent;
    });
  }

  static claimForegroundEvent(eventId: string): Promise<boolean> {
    return this.run(async () => {
      const state = await this.read();

      if (state.foregroundEventIds.includes(eventId)) {
        return false;
      }

      state.foregroundEventIds = [...state.foregroundEventIds, eventId].slice(
        -MAX_EVENT_IDS,
      );

      await this.write(state);

      return true;
    });
  }

  static savePendingEvent(
    event: QuotePushEvent,
  ): Promise<QuotePushEvent | null> {
    return this.run(async () => {
      const state = await this.read();

      if (state.handledEventIds.includes(event.eventId)) {
        return null;
      }

      state.pendingEvent = event;

      await this.write(state);

      return event;
    });
  }

  static markHandled(eventId: string): Promise<void> {
    return this.run(async () => {
      const state = await this.read();

      state.handledEventIds = [
        ...state.handledEventIds.filter(id => id !== eventId),
        eventId,
      ].slice(-MAX_EVENT_IDS);

      if (state.pendingEvent?.eventId === eventId) {
        state.pendingEvent = null;
      }

      await this.write(state);
    });
  }

  private static run<T>(operation: () => Promise<T>): Promise<T> {
    const task = this.queue.then(operation);

    this.queue = task.then(
      () => undefined,
      () => undefined,
    );

    return task;
  }

  private static async read(): Promise<StoredPushEvents> {
    const credentials = await Keychain.getGenericPassword({
      service: STORAGE_KEY,
    });

    if (!credentials) {
      return {
        foregroundEventIds: [],
        handledEventIds: [],
        pendingEvent: null,
      };
    }

    try {
      const parsed: unknown = JSON.parse(credentials.password);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid notification state');
      }

      const state = parsed as Record<string, unknown>;

      return {
        foregroundEventIds: this.readIds(state.foregroundEventIds),
        handledEventIds: this.readIds(state.handledEventIds),
        pendingEvent: this.parse(state.pendingEvent),
      };
    } catch {
      return {
        foregroundEventIds: [],
        handledEventIds: [],
        pendingEvent: null,
      };
    }
  }

  private static readIds(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (id): id is string => typeof id === 'string' && UUID_PATTERN.test(id),
      )
      .slice(-MAX_EVENT_IDS);
  }

  private static async write(state: StoredPushEvents): Promise<void> {
    const result = await Keychain.setGenericPassword(
      STORAGE_KEY,
      JSON.stringify(state),
      { service: STORAGE_KEY },
    );

    if (!result) {
      throw new Error('Unable to save notification state');
    }
  }
}
