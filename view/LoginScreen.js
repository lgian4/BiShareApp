import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Button, Dimensions, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'

const { width: WIDTH } = Dimensions.get('window');
const HEIGHT = Dimensions.get('window').height;

class LoginScreen extends React.Component {

  constructor() {
    super()


    this.state = {
      showPass: true,
      press: false,
      username: "",
      password: "",

      isLoading: true,

    }
  }
  showPass = async () => {

    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }
  onSubmit = async () => {
    const { navigation } = this.props;


  }
  onRegister = async () => {
    const { navigation } = this.props;
    navigation.navigate("Register")

  }
  onLogin = async () => {
    const { navigation } = this.props;
    navigation.navigate("Home")

  }


  render() {
    const { navigation } = this.props;
    return (

      <View style={styles.container} >
        <ImageBackground source={require('./../assets/background.png')} style={styles.image} >
          <SafeAreaView>

            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BiShare</Text>
              <Text style={styles.text}>Marketplace Polibatam</Text>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={val => this.setState({ username: val })}
                  placeholder={'Email'}
                  placeholderTextColor={'#666872'}
                  underlineColorAndroid='transparent'
                />
                <Icon name={'ios-mail-outline'} size={25} color={'#666872'} style={styles.inputIcon} />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={'Password'}
                  onChangeText={val => this.setState({ password: val })}
                  secureTextEntry={this.state.showPass}
                  placeholderTextColor={'#666872'}
                  underlineColorAndroid='transparent'
                />
                <Icon name={'ios-lock-closed-outline'} size={25} color={'#666872'} style={styles.inputIcon} />

                <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                  <Icon name={this.state.press == false ? 'ios-eye-outline' : 'ios-eye-off-outline'} size={25} color={'#666872'} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.onSubmit} style={styles.btnLupaPassword} >
                <Text style={styles.text}>Lupa Password</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onLogin} style={styles.btnLogin} >
                <Text style={styles.text}>Masuk</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.onRegister} style={styles.btnDaftar} >
                <Text style={styles.text}>Belum Punya Akun? Daftar Disini</Text>
              </TouchableOpacity>


            </View>

          </SafeAreaView>
        </ImageBackground>
      </View>

    )
  }
}


export default LoginScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,


  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 45,
    marginTop: 5,
    //  fontFamily: 'Roboto-Bold',
    textAlign: 'center'
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logoContainer: {
    marginTop: HEIGHT / 25,

    justifyContent: 'center',

  },
  bottomContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },

  subLogo: {
    color: '#666872',
    fontSize: 15,


  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#F24E1E',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnLupaPassword: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    color: '#ffffff',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnDaftar: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    color: '#F24E1E',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnRegis: {
    width: WIDTH - 55,
    height: 45,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#666872',
    justifyContent: 'center',
    marginTop: 20,
  },

  inputContainer: {
    marginTop: 10,
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    paddingLeft: 50,
    color: '#252835',
    backgroundColor: '#fff',
    marginHorizontal: 25,
  },
  inputIcon: {
    position: 'absolute',
    borderColor: '#666872',
    top: 8,
    left: 37,
    paddingRight: 5,
    borderRightWidth: 1,
  },
  btnEye: {
    position: 'absolute',
    top: 8,
    right: 37,
  }
});
