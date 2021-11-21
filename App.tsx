import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function youIsABitch(bitchState: string) {
  if (bitchState == "") {
    return "You is a Bitch."
  } else {
    return ""
  }
}

export default function App() {
  const [bitch, setBitch] = useState("");

  // Read up here for navigation between screens
  // https://reactnative.dev/docs/navigation
  return (
    <View style={styles.container}>
      <Text>Who is a big dumb bitch? {bitch}</Text>
      <Button onPress={() => setBitch(youIsABitch(bitch))} title="Find Out Now!"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
