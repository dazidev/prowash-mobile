import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { ProfileStackParamList } from '../../../../../domain';
import type { UserQuote } from '../../../../../domain/interfaces/user/user.interface';
import { QuoteService } from '../../../../../infrastructure';
import CleaningBackground from '../../../components/CleaningBackground';
import { colors } from '../../../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Quotes'>;

export const QuotesContent = () => {
  const [quotes, setQuotes] = useState<UserQuote[] | null>(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadQuotes = async () => {
        setError('');

        try {
          const response = await QuoteService.getQuotes();

          if (!active) return;

          if (!response.success || !response.data) {
            setError(response.message || 'Unable to load your quotes.');
            return;
          }

          setQuotes(response.data);
        } catch {
          if (active) {
            setError('Unable to load your quotes.');
          }
        }
      };

      void loadQuotes();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Quotes</Text>
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

        {!error &&
          quotes?.map(quote => (
            <View key={quote.id} style={styles.cardContainer}>
              <Pressable>
                <View style={styles.infoContainer}>
                  <Text style={styles.nameText}>{quote.userHouse.name}</Text>

                  <Text style={styles.infoText}>
                    Package:{' '}
                    <Text style={styles.packageText}>{quote.name}</Text>
                  </Text>

                  <Text style={styles.infoText}>
                    Status:{' '}
                    <Text style={styles.statusText}>
                      {quote.purchaseStatus.replace(/_/g, ' ').toLowerCase()}
                    </Text>
                  </Text>

                  <Text style={[styles.infoText, styles.addressText]}>
                    {quote.userHouse.street} {quote.userHouse.complementStreet}
                  </Text>

                  <Text style={styles.infoText}>
                    {quote.userHouse.city}, {quote.userHouse.state}{' '}
                    {quote.userHouse.zipcode}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))}
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
});
