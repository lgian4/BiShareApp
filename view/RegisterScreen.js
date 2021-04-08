import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet,Picker, Text, View, Image, Button, Dimensions, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

const { width: WIDTH } = Dimensions.get('window');
const  HEIGHT  = Dimensions.get('window').height;



class RegisterScreen extends React.Component {

  constructor() {
    super()


    this.state = {
      showPass:true,
      press:false,
      visibility:false,
      DateDisplay:"",
      TextInputDisableStatus: true,
      displayFormat: 'YYYY-MM-DD',
      nama:"",
      jeniskelamin:"",
      tanggallahir:"",
      email:"",
      nohp:"",
      alamat : "",
      username : "",
      password : "",
      repassword : "",

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
                  placeholder={'Nama'}
                  placeholderTextColor={'#666872'}
                  underlineColorAndroid='transparent'
                />
                <Icon name={'ios-person-outline'} size={25} color={'#666872'} style={styles.inputIcon} />
              </View>
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
                       placeholder={'Tanggal Lahir Kamu'}
                       placeholderTextColor={'#666872'}
                       underlineColorAndroid='transparent'
                       // pointerEvents="none"
                       editable={this.state.TextInputDisableStatus} 
                    
                       pointerEvents="none"
                       selectTextOnFocus={false}
                       onTouchStart={this.onPressButton}
                       value={this.state.DateDisplay ? moment(this.state.DateDisplay).format(this.state.displayFormat) : ''}
                   />
              <DateTimePickerModal 
                mode="date" 
                isVisible={this.state.visibility} 
                onConfirm={this.handleConfirm} 
                onCancel={this.onPressCancel}/>
                <Icon name={'ios-calendar-outline'} size={25} color={'#666872'} style={styles.inputIcon} />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={val => this.setState({ username: val })}
                  placeholder={'No HP'}
                  placeholderTextColor={'#666872'}
                  underlineColorAndroid='transparent'
                />
                <Icon name={'ios-phone-portrait-outline'} size={25} color={'#666872'} style={styles.inputIcon} />
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={'Re-Password'}
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
              
              <TouchableOpacity onPress={this.onSubmit} style={styles.btnLogin} >
                <Text style={styles.text}>Daftar</Text>
              </TouchableOpacity>
             
              <TouchableOpacity onPress={this.onLogin} style={styles.btnDaftar} >
                <Text style={styles.text}>Sudah Punya akun? Login Disini</Text> 
              </TouchableOpacity>


            </View>
          
        </SafeAreaView>
        </ImageBackground>
      </View>

    )
  }
}


export default RegisterScreen


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
