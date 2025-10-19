import React from "react"
import { StyleSheet, Text, View } from "react-native"
export const HomeScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          HOME SCREEN OF PROWASH 365
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  },
  title: {
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
  }
})