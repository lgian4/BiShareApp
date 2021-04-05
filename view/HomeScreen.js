import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Button, Dimensions, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

const { width: WIDTH } = Dimensions.get('window');
const  HEIGHT  = Dimensions.get('window').height;



class HomeScreen extends React.Component {

  constructor() {
    super()


    this.state = {
      showPass:true,
      press:false,
      visibility:false,
      DateDisplay:"",
      TextInputDisableStatus: true,
      displayFormat: 'YYYY-MM-DD',
      namaLengkap:"",
      alamatLengkap:"",
      email:"",
      password:"",
      konfirmasiPassword:"",
      nomorHP : "",

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

   
 showDatePicker = () => {
  this.setState({ visibility: true })  
};

onPressCancel=()=>{
  this.setState({visibility:false})
  this.setState({TextInputDisableStatus:true})
}

onPressButton=()=>{
  this.setState({visibility:true})
  this.setState({TextInputDisableStatus:false})
}

handleConfirm=(date)=>{
  this.setState({DateDisplay:date})
  this.setState({visibility:false})
  this.setState({TextInputDisableStatus:true})

}
onLogin = async () => {
  const { navigation } = this.props;
navigation.navigate("Login")

}

  

  render() {
    const { navigation } = this.props;
    return (

      <View style={styles.container} >

        <SafeAreaView>
          
          <View> <Text>test</Text><Image source={require('./../assets/logo.png')} style={{ width: 305, height: 159 }} />  </View>
          
        </SafeAreaView>
        
      </View>

    )
  }
}


export default HomeScreen


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
    marginTop: HEIGHT / 25 ,   
  
    justifyContent: 'center',

  },
  bottomContainer: {
    marginTop:  100 ,   
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
    color   : '#252835',
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
