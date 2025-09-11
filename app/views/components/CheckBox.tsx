import React, { useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

interface Props {
  checked: boolean
  onChange: (newValue: boolean) => void;
}

const CustomCheckBox: React.FC<Props> = ({checked, onChange}) => {
  return (
    <Pressable style={styles.checkboxContainer} onPress={() => onChange(!checked)}>
      <View style={[styles.checkbox, checked && styles.checked]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 20,
  },
  checked: {
    backgroundColor: '#c8ff01',
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckBox;


