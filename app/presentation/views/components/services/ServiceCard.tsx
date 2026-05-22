import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { PackageResponse } from '../../../../domain';

interface Props {
  packageInfo: PackageResponse;
}

export const ServiceCard = ({ packageInfo }: Props) => {
  const [priceSelected, setPriceSelected] = useState<string>('');

  useEffect(() => {
    const idLowestPrice = packageInfo.prices.reduce((min, current) => {
      return current.price < min.price ? current : min;
    }).id;

    setPriceSelected(idLowestPrice);
  }, []);

  const setPrice = (id: string) => {
    setPriceSelected(id);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>{packageInfo.name}</Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.rangesContainers}>
          {packageInfo.prices &&
            packageInfo.prices.map(price => (
              <Pressable
                key={price.id}
                style={styles.buttonRange}
                onPress={() => setPrice(price.id)}
              >
                <Text
                  style={[
                    { textAlign: 'center' },
                    priceSelected === price.id ? { fontWeight: 'bold' } : {},
                  ]}
                >
                  Up to {price.name} <Text>ft²</Text>
                </Text>
              </Pressable>
            ))}
        </View>
        <View style={{ marginVertical: 20, justifyContent: 'center' }}>
          <Text style={styles.serviceSubtitle}>
            USD{' '}
            {packageInfo.prices
              .filter(price => price.id === priceSelected)
              .map(price => (
                <Text
                  key={price.id}
                  style={{
                    fontSize: 60,
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {' '}
                  {price.price}{' '}
                </Text>
              ))}
            / year
          </Text>
        </View>
        <View>
          <Text style={styles.serviceSubtitle}>SERVICES INCLUDED</Text>
          {packageInfo.services.map(services => (
            <View key={services.id} style={styles.serviceContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Ionicons
                  name={'checkmark-circle-outline'}
                  size={32}
                  color={colors.darkGreen}
                />
                <Text style={styles.serviceTitle}>{services.name}</Text>
              </View>
              <Text style={styles.serviceFrequency}>
                {services.amount} x year
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ textAlign: 'center', color: 'gray' }}>
          * All prices shown are subject to change based on the final quote.
        </Text>
        <View>
          <TouchableOpacity style={styles.quoteButton}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Get a quote
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 100,
    alignContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.principalWhite,
    padding: 8,
    marginTop: 8,
    borderRadius: 15,
    textAlign: 'center',
  },
  titleContainer: {
    flex: 1,
    backgroundColor: colors.darkGreen,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  serviceContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  serviceTitle: {
    fontSize: 22,
    color: 'black',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  serviceSubtitle: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  serviceFrequency: {
    backgroundColor: colors.bgSuccess,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  buttonRange: {
    backgroundColor: colors.itemInactive,
    width: 110,
    justifyContent: 'center',
    padding: 5,
    borderRadius: 5,
  },
  rangesContainers: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  quoteButton: {
    backgroundColor: colors.darkGreen,
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
});
