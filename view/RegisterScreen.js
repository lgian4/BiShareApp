import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, Text, View,Image,Button, Dimensions,TouchableOpacity,TextInput,Alert } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'


const { width: WIDTH} = Dimensions.get('window');


class RegisterScreen extends React.Component{
    
    constructor() {
        super()
     
        
        this.state = {
            showPass:true,
            press:false,
            username:"",
            password:"",
          
            isLoading: true,
 
        }
    }
    showPass = async () => {      
     
        if (this.state.press == false){
            this.setState({ showPass: false, press:true })
        }else{
            this.setState({ showPass: true, press:false })
        }
    }

   
 
  

    onSubmit = async () => {
      const { navigation } = this.props;
    
    
    }

        
    render(){
      const { navigation } = this.props;
    return(
        
        <View style={styles.container}>
        <SafeAreaView>
            <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Selamat Datang</Text>
        <Text style={styles.logoText}>Kembalii</Text>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={val => this.setState({username:val})}
                    placeholder={'Email'}
                    placeholderTextColor={'#666872'}
                    underlineColorAndroid='transparent'
                />
                <Icon name={'ios-mail-outline'} size={25} color={'#2EAEBF'} style={styles.inputIcon}/>
                </View>

                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={'Password'}
                    onChangeText={val => this.setState({password:val})}
                    secureTextEntry = {this.state.showPass}
                    placeholderTextColor={'#666872'}
                    underlineColorAndroid='transparent'
                />
                <Icon name={'ios-lock-closed-outline'} size={25} color={'#2EAEBF'} style={styles.inputIcon}/>

                <TouchableOpacity style={styles.btnEye} onPress={this.showPass.bind(this)}>
                    <Icon name={this.state.press == false ?'ios-eye-outline' : 'ios-eye-off-outline'} size={25} color={'#666872'}/>
                </TouchableOpacity>
                </View>
            <TouchableOpacity onPress={this.onSubmit} style={styles.btnLogin} >
                  <Text style={styles.text}>Masuk</Text>
            </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center',marginTop:20}}>
                <View style={{flex: 1, height: 1, backgroundColor: '#666872'}} />
                <View>
                    <Text style={styles.subLogo}>  Atau  </Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: '#666872'}} />
                </View>
            <TouchableOpacity style={styles.btnRegis} onPress={() => navigation.navigate('Register') }>
                  <Text style={styles.text}>Daftar</Text>
            </TouchableOpacity>


            </View>
        </SafeAreaView>  
      </View>
      
    )
    }
}


export default RegisterScreen


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1F1D2A',
   
    },
    logoContainer : {
      height:'55%',
      marginLeft : 40,
      alignContent:'space-around',
      justifyContent:'center',
    
    },
    bottomContainer : {
      height:'40%',
      alignItems:'center',
      justifyContent: 'center'
    },
    logoText: {
      color : '#fff',
      fontWeight:'bold',
      fontSize : 25,
      marginTop: 5 ,
    //  fontFamily: 'Roboto-Bold',
      textAlign: 'left'
    },
    subLogo: {
      color : '#666872',
      fontSize : 15,
      
  
    },
    btnLogin: {
      width : WIDTH - 55,
      height : 45,
      borderRadius: 10,
      fontSize:16,
      backgroundColor:'#FFC52F',
      justifyContent:'center',
      marginTop: 20,
    },
    btnRegis: {
      width : WIDTH - 55,
      height : 45,
      borderStyle: 'solid',
      borderWidth : 2, 
      borderRadius: 10,
      fontSize:16,
      borderColor: '#666872',
      justifyContent:'center',
      marginTop: 20,
    },
    text: {
      color: '#fff',
      textAlign : 'center',
      fontSize : 16,
    },
    inputContainer:{
        marginTop:10,
    },
    input: {
        width: WIDTH-55,
        height:45,
        borderRadius:10,
        fontSize:16,
        paddingLeft:50,
        backgroundColor:'#252835',
        color:'#fff',
        marginHorizontal:25,
    },
    inputIcon:{
        position: 'absolute',
        borderColor:'#666872',
        top:8,
        left:37,
        paddingRight:5,
        borderRightWidth : 1, 
    },
    btnEye:{
        position:'absolute',
        top:8,
        right:37,
    }
  });
  