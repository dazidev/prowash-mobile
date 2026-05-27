import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ServicesStackParamList, UserHouse } from '../../../../../domain';
import SelectHomeViewModel from '../../../../viewmodels/order/SelectHomeViewModel';
import HouseCard from '../../../components/HouseCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CleaningBackground from '../../../components/CleaningBackground';
import { colors } from '../../../../theme/colors';
import { QuoteService } from '../../../../../infrastructure';
import TopNotification, {
  TopNotificationHandle,
} from '../../../components/overlays/TopNotification';

type Props = NativeStackScreenProps<ServicesStackParamList, 'SelectHouse'>;

export const SelectHomeScreen = ({ route, navigation }: Props) => {
  const { packageInfo } = route.params;
  const { houses, getHouses } = SelectHomeViewModel();
  const [houseSelected, setHouseSelected] = useState<string>('');
  const notifRef = useRef<TopNotificationHandle>(null);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getHouses();
    });
    return unsub;
  }, [navigation]);

  const handleSelectHouse = (houseId: string) => {
    setHouseSelected(houseId);
  };

  const handleRequestQuote = async () => {
    if (!packageInfo) return;
    if (!houseSelected) return;

    const response = await QuoteService.createPackageOrder(
      houseSelected,
      packageInfo,
    );

    if (!response.success) {
      notifRef.current?.show(`${response.message}`, 'error');
      return;
    }

    notifRef.current?.show(`${response.message}`, 'success');
    navigation.goBack();
    return;
  };

  return (
    <>
      <CleaningBackground />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <TopNotification ref={notifRef} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            <Text
              style={{ fontSize: 20, paddingHorizontal: 20, paddingBottom: 20 }}
            >
              Select a house for your service package quote:
            </Text>
            {houses && (
              <FlatList<UserHouse>
                style={{ width: '100%' }}
                contentContainerStyle={{
                  width: '100%',
                  paddingHorizontal: '5%',
                }}
                data={houses ?? []}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <HouseCard
                    name={item.name}
                    street={item.street}
                    complementStreet={item.complementStreet!}
                    city={item.city}
                    state={item.state}
                    zipcode={item.zipcode}
                    houseId={item.id}
                    imageUrl={item.imageUrl!}
                    option="select"
                    handleSelectHouse={handleSelectHouse}
                    houseSelected={houseSelected}
                  />
                )}
                scrollEnabled={false}
              />
            )}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: houseSelected ? '#c8ff01' : '#efefef' },
              ]}
              disabled={!houseSelected}
              onPress={handleRequestQuote}
            >
              <Text
                style={[
                  styles.saveText,
                  { color: houseSelected ? 'black' : '#a8a6a6' },
                ]}
              >
                Request Quote
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: colors.principalBlue,
  },
  optionsContainer: {
    position: 'relative',
    backgroundColor: colors.principalWhite,
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  saveButton: {
    position: 'relative',
    width: '90%',
    height: 60,
    backgroundColor: '#c8ff01',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
