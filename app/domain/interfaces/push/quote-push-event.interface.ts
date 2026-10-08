export type QuotePushEventType =
  | 'QUOTE_APPOINTMENT_ASSIGNED'
  | 'QUOTE_FINAL_PRICE_ASSIGNED';

export interface QuotePushEvent {
  eventId: string;
  userId: string;
  quoteId: string;
  type: QuotePushEventType;
}
