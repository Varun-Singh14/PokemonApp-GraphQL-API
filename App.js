import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import client from './apollo';
import HomeScreen from './components/HomeScreen';
import Pokemon from './components/Pokemon';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { flex: 1, },
          }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Pokemon" component={Pokemon} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};



export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
