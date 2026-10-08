import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { ProfileStackParamList } from '../../../../../domain';
import type {
  PackageOrderPurchaseStatus,
  UserQuote,
  UserQuoteResponseAction,
} from '../../../../../domain/interfaces/user/user.interface';
import { QuoteService } from '../../../../../infrastructure';
import CleaningBackground from '../../../components/CleaningBackground';
import { colors } from '../../../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Quotes'>;

const quoteStatuses: Record<
  PackageOrderPurchaseStatus,
  { label: string; color: string }
> = {
  PENDING_REVIEW: {
    label: 'Pending review',
    color: '#92400e',
  },
  ASSIGNED_APPOINTMENT: {
    label: 'Appointment assigned',
    color: colors.principalBlue,
  },
  APPOINTMENT_RESCHEDULE_REQUESTED: {
    label: 'Reschedule requested',
    color: '#c2410c',
  },
  QUOTED: {
    label: 'Final quote available',
    color: '#7e22ce',
  },
  PAID: {
    label: 'Paid',
    color: '#15803d',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: colors.itemError,
  },
};

const responseMessages: Record<UserQuoteResponseAction, string> = {
  ACCEPT_APPOINTMENT: 'Your appointment has been confirmed.',
  REQUEST_RESCHEDULE: 'Your request for a different date has been sent.',
  CANCEL_QUOTE: 'Your quote has been cancelled.',
};

function formatAppointment(date: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(new Date(date));
  } catch {
    return 'Date unavailable';
  }
}

export const QuotesContent = () => {
  const [quotes, setQuotes] = useState<UserQuote[] | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const activeRef = useRef(false);
  const submittingRef = useRef(false);
  const loadVersionRef = useRef(0);

  const loadQuotes = useCallback(async () => {
    if (!activeRef.current) return;

    const loadVersion = ++loadVersionRef.current;

    setIsLoading(true);
    setError('');

    try {
      const response = await QuoteService.getQuotes();

      if (!activeRef.current || loadVersion !== loadVersionRef.current) {
        return;
      }

      if (!response.success || !response.data) {
        setError(response.message || 'Unable to load your quotes.');
        return;
      }

      setQuotes(response.data);
    } catch {
      if (activeRef.current && loadVersion === loadVersionRef.current) {
        setError('Unable to load your quotes.');
      }
    } finally {
      if (activeRef.current && loadVersion === loadVersionRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      activeRef.current = true;

      if (!submittingRef.current) {
        setPendingId(null);
        void loadQuotes();
      }

      return () => {
        activeRef.current = false;
        loadVersionRef.current += 1;
      };
    }, [loadQuotes]),
  );

  const respondToQuote = async (
    quote: UserQuote,
    action: UserQuoteResponseAction,
  ) => {
    if (!activeRef.current || submittingRef.current || isLoading || error) {
      return;
    }

    submittingRef.current = true;
    loadVersionRef.current += 1;

    setIsLoading(false);
    setPendingId(quote.id);

    try {
      const response = await QuoteService.respondToQuote(quote.id, {
        action,
        expectedAppointmentVersion: quote.appointmentVersion,
      });

      if (!activeRef.current) return;

      if (!response.success || !response.data) {
        Alert.alert(
          'Unable to update quote',
          response.message || 'Please try again.',
        );
        return;
      }

      const updatedQuote = response.data;

      setQuotes(previous =>
        previous
          ? previous.map(item =>
              item.id === quote.id ? { ...item, ...updatedQuote } : item,
            )
          : previous,
      );

      Alert.alert('Quote updated', responseMessages[action]);
    } catch {
      if (activeRef.current) {
        Alert.alert('Unable to update quote', 'Please try again.');
      }
    } finally {
      submittingRef.current = false;

      if (activeRef.current) {
        setPendingId(null);
        void loadQuotes();
      }
    }
  };

  const confirmCancellation = (quote: UserQuote) => {
    if (submittingRef.current || isLoading || error) return;

    Alert.alert('Cancel quote?', 'Your quote request will be cancelled.', [
      {
        text: 'Keep quote',
        style: 'cancel',
      },
      {
        text: 'Cancel quote',
        style: 'destructive',
        onPress: () => {
          void respondToQuote(quote, 'CANCEL_QUOTE');
        },
      },
    ]);
  };

  const actionsDisabled = isLoading || pendingId !== null || !!error;

  return (
    <>
      <View style={[styles.titleContainer, styles.sectionHeader]}>
        <Text style={styles.title}>Quotes</Text>

        <TouchableOpacity
          disabled={isLoading || pendingId !== null}
          onPress={() => {
            if (!submittingRef.current) {
              void loadQuotes();
            }
          }}
          accessibilityLabel="Refresh quotes"
          style={
            isLoading || pendingId !== null ? styles.disabledButton : undefined
          }
        >
          {isLoading ? (
            <ActivityIndicator color={colors.principalWhite} />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {!error && quotes === null && (
          <Text style={styles.messageText}>Loading your quotes...</Text>
        )}

        {!error && quotes?.length === 0 && (
          <Text style={styles.messageText}>
            You haven't requested any quotes yet.
          </Text>
        )}

        {quotes?.map(quote => {
          const status = quoteStatuses[quote.purchaseStatus];

          const hasAppointment =
            !!quote.appointmentAt && !!quote.appointmentTimeZone;

          const canAccept =
            hasAppointment &&
            !quote.appointmentAcceptedAt &&
            (quote.purchaseStatus === 'ASSIGNED_APPOINTMENT' ||
              quote.purchaseStatus === 'QUOTED' ||
              quote.purchaseStatus === 'PAID');

          const canReschedule =
            hasAppointment && quote.purchaseStatus === 'ASSIGNED_APPOINTMENT';

          const canCancel =
            quote.purchaseStatus !== 'CANCELLED' &&
            quote.purchaseStatus !== 'PAID';

          const statusLabel =
            quote.purchaseStatus === 'ASSIGNED_APPOINTMENT' &&
            quote.appointmentAcceptedAt
              ? 'Appointment confirmed'
              : status.label;

          return (
            <View key={quote.id} style={styles.cardContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{quote.userHouse.name}</Text>

                <Text style={styles.infoText}>
                  Package: <Text style={styles.packageText}>{quote.name}</Text>
                </Text>

                <Text style={styles.infoText}>
                  Status:{' '}
                  <Text style={{ color: status.color }}>{statusLabel}</Text>
                </Text>

                <Text style={[styles.infoText, styles.addressText]}>
                  {quote.userHouse.street} {quote.userHouse.complementStreet}
                </Text>

                <Text style={styles.infoText}>
                  {quote.userHouse.city}, {quote.userHouse.state}{' '}
                  {quote.userHouse.zipcode}
                </Text>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailLabel}>Initial estimate</Text>

                  <Text style={styles.priceText}>
                    USD {quote.initialPrice.toLocaleString('en-US')}
                    {' / year'}
                  </Text>

                  <Text style={[styles.detailLabel, styles.addressText]}>
                    Final quote
                  </Text>

                  <Text style={styles.priceText}>
                    {quote.finalPrice === null
                      ? 'Not available yet'
                      : `USD ${quote.finalPrice.toLocaleString(
                          'en-US',
                        )} / year`}
                  </Text>
                </View>

                {quote.appointmentAt && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailLabel}>Visit appointment</Text>

                    <Text style={styles.infoText}>
                      {formatAppointment(quote.appointmentAt)}
                    </Text>

                    <Text style={styles.smallText}>South Carolina time.</Text>

                    <Text style={styles.smallText}>
                      {quote.purchaseStatus === 'CANCELLED'
                        ? 'Quote cancelled.'
                        : quote.purchaseStatus ===
                          'APPOINTMENT_RESCHEDULE_REQUESTED'
                        ? 'Waiting for the company to assign a new date.'
                        : quote.appointmentAcceptedAt
                        ? 'You confirmed this appointment.'
                        : 'Please confirm your appointment.'}
                    </Text>
                  </View>
                )}

                <View style={styles.actionsContainer}>
                  {canAccept && (
                    <TouchableOpacity
                      disabled={actionsDisabled}
                      onPress={() => {
                        void respondToQuote(quote, 'ACCEPT_APPOINTMENT');
                      }}
                      style={[
                        styles.actionButton,
                        styles.acceptButton,
                        actionsDisabled && styles.disabledButton,
                      ]}
                    >
                      <Text style={styles.acceptButtonText}>
                        Accept appointment
                      </Text>
                    </TouchableOpacity>
                  )}

                  {canReschedule && (
                    <TouchableOpacity
                      disabled={actionsDisabled}
                      onPress={() => {
                        void respondToQuote(quote, 'REQUEST_RESCHEDULE');
                      }}
                      style={[
                        styles.actionButton,
                        styles.rescheduleButton,
                        actionsDisabled && styles.disabledButton,
                      ]}
                    >
                      <Text style={styles.rescheduleButtonText}>
                        Request another date
                      </Text>
                    </TouchableOpacity>
                  )}

                  {canCancel && (
                    <TouchableOpacity
                      disabled={actionsDisabled}
                      onPress={() => confirmCancellation(quote)}
                      style={[
                        styles.actionButton,
                        styles.cancelButton,
                        actionsDisabled && styles.disabledButton,
                      ]}
                    >
                      <Text style={styles.cancelButtonText}>Cancel quote</Text>
                    </TouchableOpacity>
                  )}

                  {pendingId === quote.id && (
                    <ActivityIndicator color={colors.principalBlue} />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

export const QuotesScreen = ({ navigation }: Props) => {
  return (
    <>
      <CleaningBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <QuotesContent />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleContainer: {
    backgroundColor: colors.principalBlue,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.principalWhite,
  },
  optionsContainer: {
    backgroundColor: colors.principalWhite,
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: colors.principalBlue,
  },
  infoContainer: {
    padding: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 18,
  },
  packageText: {
    color: colors.principalBlue,
  },
  statusText: {
    color: colors.itemError,
  },
  addressText: {
    marginTop: 5,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: colors.bgInactive,
    borderRadius: 15,
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.itemError,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  refreshText: {
    color: colors.principalWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsSection: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
  },
  actionsContainer: {
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.principalBlue,
  },
  acceptButtonText: {
    color: colors.principalWhite,
    fontWeight: 'bold',
  },
  rescheduleButton: {
    borderWidth: 1,
    borderColor: colors.principalBlue,
    backgroundColor: colors.principalWhite,
  },
  rescheduleButtonText: {
    color: colors.principalBlue,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.itemError,
  },
  cancelButtonText: {
    color: colors.itemError,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
