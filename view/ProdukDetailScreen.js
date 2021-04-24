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
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
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

const { width: WIDTH } = Dimensions.get("window");
const HEIGHT = Dimensions.get("window").height;

const defaultOptions = {
  significantDigits: 2,
  thousandsSeparator: ".",
  decimalSeparator: ",",
  symbol: "Rp",
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
  )}${options.decimalSeparator}${decimal}`;
};

class HomeScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",

      kategori: [],
      refresh: true,
      produkmedia: [],
      produk: {
        deskripsi: "Loading...........",
        harga: "...........",
        key: "0",
        produkcode: "...........",
        produkid: 0,
        deskripsi: "----------------------",
        fitur: "----------------------",
        spesifikasi: "----------------------",
        stok: 0,
        produkmedia: {},
        produkname: "...........",
      },
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

  handleConfirm = (date) => {
    this.setState({ DateDisplay: date });
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };
  onLogin = async () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  getProduk = async () => {
    const { navigation, route } = this.props;
    const { params: selectedproduk } = route.params;

    var tempproduk = [];
    if (selectedproduk.produkmedia == null) {
      //
    } else if (typeof selectedproduk.produkmedia === "object") {
      if (
        Object.keys(selectedproduk.produkmedia) != null &&
        Object.keys(selectedproduk.produkmedia).length >= 1
      ) {
        var i = 0;
        Object.values(selectedproduk.produkmedia).forEach(function (
          produkmedia
        ) {
          if (
            produkmedia != null &&
            produkmedia.dlt == false &&
            produkmedia.mediaurl != "" 
          ) {
            tempproduk.push({
              key: i++,
              mediaid: produkmedia.mediaid,
              mediaurl: produkmedia.mediaurl,
            });
          }
        });
      }
    }
    console.log;
    this.setState({
      produk: selectedproduk,
      produkmedia: tempproduk,
      refresh: !this.state.refresh,
    });
  };

  _renderItem = ({ item }) => {
    console.log("render gambar");
    console.log(item.mediaurl);
    return (
      <TouchableOpacity onPress={async (xitem) => {}}>
        <Image
          source={{ uri: item.mediaurl }}
          style={{
            
            height:HEIGHT/2-20,
            width:WIDTH-30,
            marginHorizontal:10,            
            borderWidth: 0,
            borderRadius: 10,
            
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  componentDidMount() {
    this.getProduk();
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 10,
              }}
            >
              <View style={{ marginTop: 20 }}>
                <Icon
                  name={"chevron-back-outline"}
                  size={25}
                  color={"#666872"}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <Icon name={"cart"} size={25} color={"#666872"} />
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text
                style={{ fontSize: 14, color: "#F24E1E", fontWeight: "bold" }}
              >
                {currencyFormatter(this.state.produk.harga, defaultOptions)}
              </Text>
              <Text
                style={{ fontSize: 28, color: "black", fontWeight: "bold" }}
              >
                {this.state.produk.produkname}
              </Text>
            </View>
            <View style={{ alignItems: "center", marginTop:20,}}>
                  <FlatList
                    data={this.state.produkmedia}
                    extraData={this.state.refresh}
                    style={{ flexGrow: 0, height:HEIGHT/2 +20 ,width:WIDTH, }}
                    horizontal={true}
                    renderItem={this._renderItem}
                    keyExtractor={(item) =>
                      item.mediaid == null ? "" : item.mediaid.toString()
                      
                    }
                  />
                </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ fontSize: 16, color: "black" }}>
                    Deskripsi
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F24E1E",
                      height: 3,
                      marginTop: 10,
                      width: 25,
                      marginBottom: 20,
                    }}
                  ></View>
                </View>
                <View>
                  <Text style={{}}>{this.state.produk.deskripsi}</Text>
                </View>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ fontSize: 16, color: "black" }}>Fitur</Text>
                  <View
                    style={{
                      backgroundColor: "#F24E1E",
                      height: 3,
                      marginTop: 10,
                      width: 25,
                      marginBottom: 20,
                    }}
                  ></View>
                </View>
                <View>
                  <Text style={{}}>{this.state.produk.fitur}</Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "black" }}>
                    Spesifikasi
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F24E1E",
                      height: 3,
                      marginTop: 10,
                      width: 25,
                    }}
                  ></View>
                </View>
                <View>
                  <Text style={{}}>{this.state.produk.spesifikasi}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                bottom: -100,
                alignItems: "center",
                justifyContent: "space-evenly",
                width: WIDTH,
                flexDirection: "row",
                position: "absolute",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 45,
                  borderRadius: 10,
                  fontSize: 16,
                  borderColor: "#F24E1E",
                  borderWidth: 1,
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                  backgroundColor: "white",
                  marginTop: 20,
                  paddingHorizontal: 10,

                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                }}
              >
                <Icon
                  name={"heart-outline"}
                  size={25}
                  color={"#666872"}
                  style={{ color: "#F24E1E", marginTop: 10 }}
                />
                <Text
                  style={[styles.text, { color: "#F24E1E", marginTop: 10 }]}
                >
                  Favorit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 45,
                  borderRadius: 10,
                  fontSize: 16,
                  backgroundColor: "#F24E1E",
                  justifyContent: "center",
                  marginTop: 20,
                  paddingHorizontal: 10,

                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                }}
              >
                <Text style={styles.text}>Masukkan Ke Keranjang</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default HomeScreen;

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
});
