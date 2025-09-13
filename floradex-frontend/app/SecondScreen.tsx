import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SecondScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the second screen!</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
