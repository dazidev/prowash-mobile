import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import BackgroundBubbles from '../../components/BackgroundBubbles';

export const LoadingScreen = () => {
  return (
    <>
      <BackgroundBubbles />

      <View style={styles.container}>
        <ActivityIndicator size="large" color="#c8ff01" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
