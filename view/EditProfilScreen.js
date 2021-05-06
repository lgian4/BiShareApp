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
import moment from "moment";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";

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

const { width: WIDTH } = Dimensions.get("window");
const HEIGHT = Dimensions.get("window").height;

const defaultOptions = {
  significantDigits: 2,
  thousandsSeparator: ".",
  decimalSeparator: ",",
  symbol: "Rp",
};

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@storage_Key:" + key, jsonValue);
  } catch (e) {
    // saving error
    this.notify(e);
    return;
  }
};
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storage_Key:" + key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    // this.notify(e);
    return;
  }
};

const currencyFormatter = (value, options) => {
  if (typeof value != "number") {
    value = parseInt(value);
  }
  if (typeof value !== "number") value = 0.0;
  options = { ...defaultOptions, ...options };
  value = value.toFixed(options.significantDigits);

  const [currency, decimal] = value.split(".");
  return `${options.symbol} ${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator
  )}`;
};

class EditProfilScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",
      user: null,
      kategori: [],
      produklike: {
        key: 0,
        islike: false,
        userid: "",
      },
      showPass: true,
      firstmedia: "",
      keranjanglist: [],
      keranjang: {
        key: 0,
        dlt: true,
        produkid: "",
        userid: "",
        mediaurl: "",
        produkname: "",
        stok: 0,
        harga: 0
      },
      refresh: true,
      totalproduk: 0,
      totalharga: 0,
      isFetching: true,
    };
  }

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



  handleConfirm = (date) => {
    this.setState({ DateDisplay: date });
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };





  onLogout = async () => {
    const { navigation } = this.props;

    Alert.alert(
      "Log Out",
      "Apakah anda yakin untuk keluar ?",

      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            try {

              await storeData("user", null);
              navigation.navigate("RegisterTab");
            } catch (error) {
              console.error(error);
            }

          }
        }
      ]
    );


  };
  async componentDidMount() {
    var tsuer = await getData("user");
    console.log(tsuer);
    this.setState({ user: tsuer });
    //  this.loadKeranjang();
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ height: HEIGHT }}>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 15,
              paddingBottom: 10,
              backgroundColor: "white"
            }}
          >
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={() => { const { navigation } = this.props; navigation.goBack(); }}>
                <Icon name={"chevron-back-outline"} size={25} color={"#666872"} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Edit Profil</Text>
            <View style={{ marginTop: 20 }}>
              <Icon name={"cart"} size={25} color={"white"} />
            </View>
          </View>


          <View style={{ marginTop: 10, marginHorizontal: 0, width: WIDTH, paddingBottom: 20, borderRadius: 10, backgroundColor: "white", }}>


            <View style={{ justifyContent: "center", paddingHorizontal: 20, paddingVertical: 10 }}>

              <Text style={{ color: "#666872", fontSize: 16, }}>Data User</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={"Password"}
                onChangeText={(val) => this.setState({ password: val })}
                secureTextEntry={this.state.showPass}
                placeholderTextColor={"#666872"}
                underlineColorAndroid="transparent"
              />
              <Icon
                name={"ios-lock-closed-outline"}
                size={25}
                color={"#666872"}
                style={styles.inputIcon}
              />

              
            </View>
            <View style={{ borderWidth: 1, borderColor: "#F3F3F3", width: WIDTH }}></View>
          </View>

          <View style={{}}>


          </View>

        </SafeAreaView>
        <View style={{ position: "absolute", bottom: 0, padding: 15, flexDirection: 'row', alignContent: "space-between", width: WIDTH, backgroundColor: "white", borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: 20 }}>
          <Text style={{ flex: 1, textAlign: "left" }}>V 0.0.1</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1, textAlign: "right", color: "#F24E1E" }}>BiShare</Text>
        </View>
      </View>
    );
  }
}

export default EditProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    height: HEIGHT
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
});
