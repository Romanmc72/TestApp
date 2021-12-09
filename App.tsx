import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './lib/home';
import {ScoreboardScreen} from './lib/scoreboard';

const Stack = createNativeStackNavigator();

/**
 * This is the default app creation function, it renders the app and loads
 * the relationships for navigating between pages
 * @return {JSX.Element} - The app and its landing page
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={ HomeScreen }
          options={{title: 'Join Or Start A Scoreboard'}}
        />
        <Stack.Screen
          name="Scores"
          component={ ScoreboardScreen }
          options={{title: 'Scoreboard'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
