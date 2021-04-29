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
  )}${options.decimalSeparator}${decimal}`;
};

class KeranjangScreen extends React.Component {
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
      firstmedia: "",
      keranjang: {
        key: 0,
        dlt: true,
        produkid: "",
        userid: "",
        mediaurl: "",
        produkname: "",
        stok : 0,
        harga : 0
      },
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
        tokoname: ""
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
 

  getProduk = async () => {
    const { navigation, route } = this.props;
    const { params: selectedproduk } = route.params;
    var tuser = this.state.user;
    if (tuser == null)
      tuser = await getData("user");

    var firstmedia = "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e";
    var tempproduk = [];
    if (selectedproduk.produkmedia == null) {
      tempproduk.push({
        key: 0,
        mediaid: 0,
        mediaurl:  "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e",
      });
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
            if(i ==0)
            {
              firstmedia = produkmedia.mediaurl
            }
            tempproduk.push({
              key: i++,
              mediaid: produkmedia.mediaid,
              mediaurl: produkmedia.mediaurl,
            });
          }
        });
      }
    }

    this.setState({
      produk: selectedproduk,
      produkmedia: tempproduk,
      refresh: !this.state.refresh,
      firstmedia:firstmedia,
    });
    var tproduklike = null;
    var tkeranjang = null;

    try {
      console.log("produklike/" + selectedproduk.produkid + "/" + tuser.userid);
      await firebase
        .database()
        .ref("produklike/" + selectedproduk.produkid + "/" + tuser.userid)
        .on("value", (snapshot) => {

          console.log("console.log(snapshot); " + snapshot);
          console.log("console.log(snapshot.key); " + snapshot.key);
          console.log("console.log(snapshot.val); " + snapshot.val());
          if (snapshot != null && snapshot.val() != null
          ) {
            tproduklike = {
              key: snapshot.key,
              islike: snapshot.val().islike ?? false,
              userid: snapshot.val().userid ?? tuser.userid,
              produkid: snapshot.val().produkid ?? selectedproduk.produkid,
            };

            this.setState({  produklike: tproduklike });
          }

        });
    } catch (error) {
      //console.error(error);
    }

    try {      
      await firebase
        .database()
        .ref("keranjang/" + tuser.userid + "/" + selectedproduk.produkid )
        .on("value", (snapshot) => {
          if (snapshot != null && snapshot.val() != null
          ) {
            tkeranjang = {           
              key: snapshot.key,
              dlt: snapshot.val().dlt ?? false,
              produkid: snapshot.val().produkid ?? selectedproduk.produkid,
              userid: snapshot.val().userid ?? tuser.userid,
              mediaurl:firstmedia,
              produkname: selectedproduk.produkname,
              stok : snapshot.val().stok ?? 0,
              harga : selectedproduk.harga
            };

            this.setState({  keranjang: tkeranjang });
          }

        });
    } catch (error) {
      //console.error(error);
    }

    if (tproduklike == null) {
      tproduklike = {
        key: tuser.userid,
        islike: false,
        userid: tuser.userid,
      }
    }
    if (tkeranjang == null) {
      tkeranjang =   {
        key: selectedproduk.produkid,
        dlt: true,
        produkid: selectedproduk.produkid,
        userid: tuser.userid,
        mediaurl: firstmedia,
        produkname: selectedproduk.produkname,
        stok : 0,
        harga :selectedproduk.harga
      }
    }
    this.setState({ user: tuser, produklike: tproduklike });
    //storeData("produk", tempproduk);

  };



  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={async (xitem) => { }}>
        <Image
          source={{ uri: item.mediaurl }}
          style={{

            height: HEIGHT / 2 - 20,
            width: WIDTH - 30,
            marginHorizontal: 10,
            borderWidth: 0,
            borderRadius: 10,

          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  componentDidMount() {
    var tsuer = getData("user");
    this.setState({ user: tsuer });
   // this.getProduk();
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
                paddingTop: 15,
              }}
            >
              <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={() => { const { navigation } = this.props; navigation.goBack(); }}>
                  <Icon name={"chevron-back-outline"} size={25} color={"#666872"} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Keranjang Belanjaan</Text>
              <View style={{ marginTop: 20 }}>
                <Icon name={"cart"} size={25} color={"white"} />
              </View>
            </View>

         <View>
         <TouchableOpacity >
        <View
          style={{
            width: WIDTH / 2.5,
            backgroundColor: "white",
            marginTop: 10,
            borderRadius: 10,
            alignSelf: "flex-start",
            padding: 10,
            marginHorizontal: 10,

flexDirection:"row"
          }}
        >

<View style={{ marginHorizontal:10, width: 90, backgroundColor:"#F6F6F6", height: 90, overflow: 'hidden', borderRadius: 10}}>
            <Image
              style={{  width: '100%', height: '100%'}}
              resizeMode={"contain"}
              source={{ uri: "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e" }}
            />
          </View>
     
         <View>
          <Text style={{ fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={1}>
            Nama
          </Text>
          <Text>Rp 20.000{/* {currencyFormatter(item.harga)} */}</Text>

          <View style={{flexDirection:"row"}}>
            <Icon name={"minus"} size={25} color={"black"} />           
          </View>
         </View>
          
        
        
        </View>
      </TouchableOpacity>
         </View>
            <View style={{ alignItems: "center", marginTop: 20, }}>
              <FlatList
                data={this.state.produkmedia}
                extraData={this.state.refresh}
                style={{ flexGrow: 0, height: HEIGHT / 2 + 10, width: WIDTH, }}
                horizontal={true}
                renderItem={this._renderItem}
                keyExtractor={(item) =>
                  item.mediaid == null ? "" : item.mediaid.toString()

                }

                pagingEnabled={true}
              />
            </View>
           
          </ScrollView>
        
        </SafeAreaView>
      </View>
    );
  }
}

export default KeranjangScreen;

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
