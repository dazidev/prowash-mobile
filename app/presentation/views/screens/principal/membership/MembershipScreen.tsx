import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import type { ProfileStackParamList } from '../../../../../domain';
import CleaningBackground from '../../../components/CleaningBackground';
import { colors } from '../../../../theme/colors';
import { QuotesContent } from './QuotesScreen';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipHome'>;

export const MembershipScreen = ({ navigation }: Props) => {
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

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Memberships</Text>
        </View>

        <View style={styles.membershipContainer}>
          <Text style={styles.messageText}>
            You don't have any active memberships yet.
          </Text>
        </View>

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
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: colors.principalBlue,
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
  membershipContainer: {
    backgroundColor: colors.principalWhite,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
