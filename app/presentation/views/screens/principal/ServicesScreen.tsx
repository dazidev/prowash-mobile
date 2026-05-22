import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import CleaningBackground from '../../components/CleaningBackground';
import { ServiceCard } from '../../components/services/ServiceCard';
import { CatalogService } from '../../../../infrastructure/services/catalog/catalog.service';
import { PackageResponse } from '../../../../domain';
import { colors } from '../../../theme/colors';
import { useFocusEffect } from '@react-navigation/native';
export const ServicesScreen = () => {
  const [option, setOption] = useState<'packages' | 'services'>('packages');
  const [data, setData] = useState<PackageResponse[]>();

  useFocusEffect(
    useCallback(() => {
      const loadPackages = async () => {
        const packages = await CatalogService.getPackages();

        if (packages.data) {
          setData(packages.data);
        }
      };

      loadPackages();
    }, []),
  );

  return (
    <>
      <CleaningBackground />
      <View style={{ width: 'auto', marginTop: 70 }}>
        <View style={styles.mainToggle}>
          <TouchableOpacity
            style={[
              styles.toggle,
              option === 'packages'
                ? { backgroundColor: colors.principalWhite }
                : {},
            ]}
          >
            <Text
              style={[
                styles.textToggle,
                option === 'packages' ? {} : { color: colors.principalWhite },
              ]}
            >
              Packages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggle,
              option === 'services'
                ? { backgroundColor: colors.principalWhite }
                : {},
            ]}
          >
            <Text
              style={[
                styles.textToggle,
                option === 'services' ? {} : { color: colors.principalWhite },
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {data &&
          data.map(pack => <ServiceCard key={pack.id} packageInfo={pack} />)}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
    alignContent: 'center',
    paddingHorizontal: 16,
  },
  mainToggle: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    padding: 6,
    marginBottom: 10,
    justifyContent: 'center',
    backgroundColor: colors.principalBlue,
    borderRadius: 20,
  },
  textToggle: {
    fontSize: 20,
  },
  toggle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});
