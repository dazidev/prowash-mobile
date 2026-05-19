import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CleaningBackground from '../../components/CleaningBackground';
import { ServiceCard } from '../../components/services/ServiceCard';
export const ServicesScreen = () => {
  const [option, setOption] = useState();

  return (
    <>
      <CleaningBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ServiceCard />
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
