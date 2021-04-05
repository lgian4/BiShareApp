import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Button, Dimensions, TouchableOpacity, TextInput, Alert,FlatList, ImageBackground } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'


const { width: WIDTH } = Dimensions.get('window');
const HEIGHT = Dimensions.get('window').height;


const harga = [
  {nama:'Rekomendasi',key:'Melchem'},
  {nama:'Semua',key:'mrasyid.haikal@gmail.com'},
  {nama:'Baju',key:'M Rasyid Khaikal'},  
  {nama:'Nomor KTP',key:'511243'},
  {nama:'Tempat Lahir',key:'password'}]

class HomeScreen extends React.Component {

  constructor() {
    super()


    this.state = {
      showPass: true,
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: 'YYYY-MM-DD',
      namaLengkap: "",
      alamatLengkap: "",
      email: "",
      password: "",
      konfirmasiPassword: "",
      nomorHP: "",

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
  _renderItem =({item,index}) =>{
      
    return(
        <TouchableOpacity>
      <View style={{paddingHorizontal:15,paddingVertical:9,borderRadius:20, backgroundColor:'#F24E1E',marginHorizontal:7 }}>
        <Text style={{color:'white'}}>{item.nama}</Text>
        
      </View>
      </TouchableOpacity>
    )
}



  showDatePicker = () => {
    this.setState({ visibility: true })
  };

  onPressCancel = () => {
    this.setState({ visibility: false })
    this.setState({ TextInputDisableStatus: true })
  }

  onPressButton = () => {
    this.setState({ visibility: true })
    this.setState({ TextInputDisableStatus: false })
  }

  handleConfirm = (date) => {
    this.setState({ DateDisplay: date })
    this.setState({ visibility: false })
    this.setState({ TextInputDisableStatus: true })

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 }}>
            <View style={{}}>
              <Image source={require('./../assets/logo.png')} style={{ width: WIDTH / 4 }} resizeMode='contain' />
            </View>

            <View style={{ marginTop: 20 }}>
              <Icon name={'ios-person'} size={25} color={'#666872'} />
            </View>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 16 }}>Hi, Andrea</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={val => this.setState({ username: val })}
              placeholder={'Search '}
              placeholderTextColor={'#666872'}
              underlineColorAndroid='transparent'

            />
            <Icon name={'search'} size={25} color={'#666872'} style={styles.inputIcon} />
          </View>
          <View style={{ backgroundColor: '#F6F6F6', height: HEIGHT, marginTop: 10, borderRadius: 10,paddingVertical:10 }}>
          <FlatList
          data={harga}
          style={{}}
          horizontal={true}
          renderItem = {this._renderItem}
          keyExtractor={(item, index)=> index.toString()}
          
          />

          </View>
        </SafeAreaView>

      </View>

    )
  }
}


export default HomeScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',

  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    width: WIDTH / 20,
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
    borderColor: '#BABABA',
    borderWidth: 1
  },
  inputIcon: {
    position: 'absolute',
    borderColor: '#666872',
    top: 8,
    left: 37,
    paddingRight: 5,

  },
  btnEye: {
    position: 'absolute',
    top: 8,
    right: 37,
  }
});
