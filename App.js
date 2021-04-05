import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './view/LoginScreen';
import RegisterScreen from './view/RegisterScreen';
import HomeScreen from './view/HomeScreen';

const RegisterStack = createStackNavigator();
const AuthStack = createStackNavigator();
const RegisterTab = () => {
  return (
    <RegisterStack.Navigator
      screenOptions={{ gestureEnabled: false, headerShown: false }}
    >


      <RegisterStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <RegisterStack.Screen
        name="Register"
        component={RegisterScreen}
      />
       <RegisterStack.Screen
        name="Home"
        component={HomeScreen}
      />

    </RegisterStack.Navigator>
  );
}



export default class App extends React.Component {


  constructor() {
    super()


    this.state = {
      tokenUser: "",
      tokenExpire: "",
    }
  }



  render() {

    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{ gestureEnabled: false, headerShown: false }}

        >
          <AuthStack.Screen
            name="splash"
            component={RegisterTab}
          />






        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
