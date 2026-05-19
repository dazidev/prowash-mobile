import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';

interface Props {}

export const ServiceCard = () => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>BASIC</Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.rangesContainers}>
          <Pressable style={styles.buttonRange}>
            <Text style={{ textAlign: 'center' }}>
              Up to 1000 <Text>ft²</Text>
            </Text>
          </Pressable>
          <Pressable style={styles.buttonRange}>
            <Text style={{ textAlign: 'center' }}>
              Up to 2000 <Text>ft²</Text>
            </Text>
          </Pressable>
          <Pressable style={styles.buttonRange}>
            <Text style={{ textAlign: 'center' }}>
              Up to 3000 <Text>ft²</Text>
            </Text>
          </Pressable>
        </View>
        <View style={{ marginVertical: 20, justifyContent: 'center' }}>
          <Text style={styles.serviceSubtitle}>
            USD{' '}
            <Text
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              800
            </Text>{' '}
            / year
          </Text>
        </View>
        <View>
          <Text style={styles.serviceSubtitle}>SERVICES INCLUDED</Text>
          <View style={styles.serviceContainer}>
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
              <Text style={styles.serviceTitle}>HOUSE WASHING</Text>
            </View>
            <Text style={styles.serviceFrequency}>2 x year</Text>
          </View>
          <View style={styles.serviceContainer}>
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
              <Text style={styles.serviceTitle}>HOUSE WASHING</Text>
            </View>
            <Text style={styles.serviceFrequency}>2 x year</Text>
          </View>
          <View style={styles.serviceContainer}>
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
              <Text style={styles.serviceTitle}>HOUSE WASHING</Text>
            </View>
            <Text style={styles.serviceFrequency}>2 x year</Text>
          </View>
          <View style={styles.serviceContainer}>
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
              <Text style={styles.serviceTitle}>HOUSE WASHING</Text>
            </View>
            <Text style={styles.serviceFrequency}>2 x year</Text>
          </View>
        </View>
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
