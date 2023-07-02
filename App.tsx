import React, {Component} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './Screens/Home';
import Details from './Screens/Details';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor={'#CCC'} barStyle={'dark-content'} />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
