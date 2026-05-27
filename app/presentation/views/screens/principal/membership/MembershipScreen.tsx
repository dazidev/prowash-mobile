import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ProfileStackParamList } from '../../../../../domain';
import CleaningBackground from '../../../components/CleaningBackground';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../../../../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import { QuoteService } from '../../../../../infrastructure';
import { UserQuote } from '../../../../../domain/interfaces/user/user.interface';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipHome'>;

interface Data {
  quotes: UserQuote[];
}

export const MembershipScreen = ({ navigation }: Props) => {
  const [data, setData] = useState<Data>();

  useFocusEffect(
    useCallback(() => {
      const loadQuotes = async () => {
        const quotes = await QuoteService.getQuotes();

        if (quotes.data) {
          setData(prev => ({ ...prev, quotes: quotes.data! }));
        }
      };

      loadQuotes();
    }, []),
  );

  return (
    <>
      <CleaningBackground />
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quotes</Text>
        </View>

        <View style={styles.optionsContainer}>
          {data &&
            data.quotes.map(quote => (
              <View key={quote.id} style={[styles.cardContainer]}>
                <Pressable>
                  <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{quote.userHouse.name}</Text>
                    <Text style={styles.infoText}>
                      Package:{' '}
                      <Text
                        style={{
                          color: colors.principalBlue,
                        }}
                      >
                        {quote.name}
                      </Text>
                    </Text>
                    <Text style={styles.infoText}>
                      State:{' '}
                      <Text
                        style={{
                          color: colors.itemError,
                        }}
                      >
                        {quote.purchaseStatus
                          .replace('_', ' ')
                          .toLocaleLowerCase()}
                      </Text>
                    </Text>
                    <Text style={[styles.infoText, { marginTop: 5 }]}>
                      {quote.userHouse.street}{' '}
                      {quote.userHouse.complementStreet}
                    </Text>
                    <Text style={[styles.infoText]}>
                      {quote.userHouse.city}, {quote.userHouse.state}{' '}
                      {quote.userHouse.zipcode}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    padding: '5%',
    marginTop: 20,
  },
  titleContainer: {
    position: 'relative',
    backgroundColor: colors.principalBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.principalWhite,
    textAlign: 'left',
  },
  optionsContainer: {
    position: 'relative',
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
  cardContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: colors.bgInactive,
    borderRadius: 15,
    marginBottom: '5%',
  },
});
