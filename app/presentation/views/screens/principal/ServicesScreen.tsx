import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CleaningBackground from '../../components/CleaningBackground';
import { ServiceCard } from '../../components/services/ServiceCard';
import { CatalogService } from '../../../../infrastructure/services/catalog/catalog.service';
import { PackageResponse } from '../../../../domain';
export const ServicesScreen = () => {
  const [option, setOption] = useState();
  const [data, setData] = useState<PackageResponse[]>();

  useEffect(() => {
    const loadPackages = async () => {
      const packages = await CatalogService.getPackages();

      if (packages.data) {
        setData(packages.data);
      }
    };

    loadPackages();
  }, []);

  return (
    <>
      <CleaningBackground />
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
    paddingVertical: 100,
    alignContent: 'center',
    paddingHorizontal: 16,
  },
});
