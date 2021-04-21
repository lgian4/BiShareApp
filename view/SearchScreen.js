import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  ImageBackground,
  ScrollView,
  ToastAndroid,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage  from "@react-native-community/async-storage";
import moment from "moment";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAG7oZ5gK_4JfibKyOXG4oXqleART-e8vA",
  authDomain: "bishare-48db5.firebaseapp.com",
  databaseURL: "https://bishare-48db5-default-rtdb.firebaseio.com/",
  projectId: "bishare-48db5",
  storageBucket: "bishare-48db5.appspot.com",
  messagingSenderId: "sender-id",
  appId: "1:250899433800:android:982f8764221e4e5666cb7d",
  measurementId: "G-measurement-id",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const storeData = async (key,value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key:'+key, jsonValue)
  } catch (e) {
    // saving error
    this.notify(e);
    return;
  }
}
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key:'+key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
    this.notify(e);
    return;
  }
}


const { width: WIDTH } = Dimensions.get("window");
const HEIGHT = Dimensions.get("window").height;

class SearchScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",

      kategori: [],
      produk: [],
      refresh: true,
    };
  }
  notify = (message) => {
    if (Platform.OS != "android") {
      // Snackbar.show({
      //     text: message,
      //     duration: Snackbar.LENGTH_SHORT,
      // });
    } else {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };
  LoadData = async () => {

   console.log(await getData("user"));

  };

  loadProduk = async () => {
    console.log("produk length");
    console.log(this.state.produk.length);

    var tempproduk = [];

    if (this.state.produk == null || this.state.produk.length <= 0) {
      firebase
        .database()
        .ref("produk/")
        .on("value", (snapshot) => {
          snapshot.forEach((child) => {
            if (child.key != "count" && child.val().dlt != true) {
              tempproduk.push({
                key: child.key,
                produkcode: child.val().produkcode,
                deskripsi: child.val().deskripsi,
                produkid: child.val().produkid,
                produkname: child.val().produkname,
                harga: child.val().harga,
              });
            }
          });
        });

      this.setState({ produk: tempproduk });
      if (!this.state.refresh) {
        this.setState({ refresh: true });
      }
    }
  };
  onSubmit = async () => {
    const { navigation } = this.props;
  };

  onPressCancel = () => {
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };

  onPressButton = () => {
    this.setState({ visibility: true });
    this.setState({ TextInputDisableStatus: false });
  };

  handleConfirm = (date) => {
    this.setState({ DateDisplay: date });
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };
  onLogin = async () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  render() {
    this.LoadData();
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 10,
              marginBottom:20
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Icon name={"chevron-back-outline"} size={25} color={"#666872"} />
            </View>
<Text style={{fontSize:16,fontWeight:'bold',marginTop:20}}>Pencarian</Text>
            <View style={{ marginTop: 20 }}>
              <Icon name={"cart"} size={25} color={"#666872"} />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(val) => this.setState({ username: val })}
              placeholder={"Search "}
              placeholderTextColor={"#666872"}
              underlineColorAndroid="transparent"
            />
            <Icon
              name={"search"}
              size={25}
              color={"#666872"}
              style={styles.inputIcon}
            />
          </View>
         
         <View style={{paddingHorizontal:25,marginTop:20}}>
           <Text style={{fontSize:16}}>Pencarian Terakhir</Text>

           <View style={{ flexDirection:'row',}}>
           <Icon name={'ios-timer-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
              <Text style={{flex:2, fontSize:16, marginTop:11,marginLeft:5}}>Favorit</Text>
              <Icon name={'ios-close-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
           </View>
           <View style={{ flexDirection:'row',}}>
           <Icon name={'ios-timer-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
              <Text style={{flex:2, fontSize:16, marginTop:11,marginLeft:5}}>Favorit</Text>
              <Icon name={'ios-close-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
           </View>
           <View style={{ flexDirection:'row',}}>
           <Icon name={'ios-timer-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
              <Text style={{flex:2, fontSize:16, marginTop:11,marginLeft:5}}>Favorit</Text>
              <Icon name={'ios-close-outline'} size={25} color={'#666872'} style={{marginTop:10}} />
           </View>
         </View>
         <TouchableOpacity>
          <View
                style={{
                  width: WIDTH / 2.5,
                  backgroundColor: "white",
                  marginTop: 10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  padding: 10,
                  marginHorizontal:10,
                  borderWidth:1,
                }}
              >
                <Image
                  source={require("./../assets/produk.png")}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "bold" }}>Sendal</Text>
                <Text>Rp. 20.000</Text>
              </View>
      </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logo: {
    flex: 1,
    width: WIDTH / 20,
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 45,
    marginTop: 5,
    //  fontFamily: 'Roboto-Bold',
    textAlign: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  logoContainer: {
    marginTop: HEIGHT / 25,

    justifyContent: "center",
  },
  bottomContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  subLogo: {
    color: "#666872",
    fontSize: 15,
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#F24E1E",
    justifyContent: "center",
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
    color: "#252835",
    backgroundColor: "#fff",
    marginHorizontal: 25,
    borderColor: "#BABABA",
    borderWidth: 1,
  },
 
  btnEye: {
    position: "absolute",
    top: 8,
    right: 37,
  },
  inputIcon: {
    position: 'absolute',
    borderColor: '#666872',
    top: 8,
    left: 37,
    paddingRight: 5,
    
  },
});
