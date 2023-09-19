import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './src/components/screens/Splash';
import Signup from './src/components/screens/Signup';
import Login from './src/components/screens/Login';
import BottomNavigation from './src/components/Navigation/BottomNavigation';
import Users from './src/components/screens/Users';
import Chat from './src/components/screens/Chat';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={BottomNavigation} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
