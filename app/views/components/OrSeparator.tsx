import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrSeparator = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>Or</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  text: {
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default OrSeparator;
