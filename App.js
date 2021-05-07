import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './view/LoginScreen';
import RegisterScreen from './view/RegisterScreen';
import HomeScreen from './view/HomeScreen';
import ProdukDetailScreen from './view/ProdukDetailScreen';
import KeranjangScreen from './view/KeranjangScreen';
import ReviewScreen from './view/ReviewScreen';
import SearchScreen from './view/SearchScreen';
import ProfilScreen from './view/ProfilScreen';
import EditProfilScreen from './view/EditProfilScreen';
import ChangePasswordScreen from './view/ChangePasswordScreen';
import AsyncStorage from "@react-native-community/async-storage";

const RegisterStack = createStackNavigator();
const HomeStack = createStackNavigator();
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
        name="HomeTab"
        component={HomeTab}
      />


    </RegisterStack.Navigator>
  );
}

const HomeTab = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ gestureEnabled: false, headerShown: false }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ProdukDetail" component={ProdukDetailScreen} />
      <HomeStack.Screen name="Review" component={ReviewScreen} />
      <HomeStack.Screen name="Keranjang" component={KeranjangScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="Profil" component={ProfilScreen} />
      <HomeStack.Screen name="EditProfil" component={EditProfilScreen} />
      <HomeStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <HomeStack.Screen name="RegisterTab" component={RegisterTab} />
    </HomeStack.Navigator>
  )
}


const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key:' + key, jsonValue)
  } catch (e) {
    // saving error
    this.notify(e);
    return;
  }
}
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key:' + key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    this.notify(e);
    return;
  }
}



export default class App extends React.Component {


  constructor() {
    super()

  

    this.state = {
      tokenUser: "",
      tokenExpire: "",
      user:[]
    }
  }
  UserData = async() => {
    this.state.user = await getData("user");
  }
  componentDidMount() { this.UserData(); }

  render() {

    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{ gestureEnabled: false, headerShown: false }}

        >
          {this.state.user == null ||  this.state.user.userid == '' ? (
            <AuthStack.Screen
              name="RegisterTab"
              component={RegisterTab}
            />
          ) : (
            <AuthStack.Screen
              name="HomeTab"
              component={HomeTab}
            />
          )}
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
