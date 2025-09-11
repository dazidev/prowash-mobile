import React from "react"
import { StyleSheet, Text, View } from "react-native"
import BackgroundBubbles from "../components/BackgroundBubbles"
export const ServicesScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          SERVICES SCREEN OF PROWASH 365
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