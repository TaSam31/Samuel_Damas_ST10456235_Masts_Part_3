import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddMenuScreen from './screens/AddMenuScreen';
import FilterMenuScreen from './screens/FilterMenuScreen';
import { RootStackParamList } from './types';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddMenu" component={AddMenuScreen} />
          <Stack.Screen name="FilterMenu" component={FilterMenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>

  );
}
