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

class ChatScreen extends React.Component {
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
      keranjanglist: [],
      userchats: [],
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

  onAddStok = async (item) => {
    this.setState({ isFetching: true })
    var tkeranjanglist = this.state.keranjanglist;
    var tuser = this.state.user;
    if (tuser == null)
      tuser = await getData("user");
    var ttotalharga = 0;
    var ttotalproduk = 0;
    var selected = null;
    tkeranjanglist.forEach(function (obj) {

      if (obj.produkid === item.produkid) {
        selected = obj;
        obj.stok = obj.stok + 1;
        if (obj.stok == 0)
          obj.dlt = true;
      }
      ttotalproduk = ttotalproduk + 1;
      ttotalharga = ttotalharga + (obj.stok * obj.harga);
    });
    console.log(tkeranjanglist.length);

    // this.setState({ keranjanglist: tkeranjanglist, totalharga: ttotalharga, totalproduk: ttotalproduk,  });
    firebase
      .database()
      .ref("keranjang/" + tuser.userid + "/" + item.produkid)
      .set(selected);

    await this.loadChat();
  }
  onMinusStok = async (item) => {
    this.setState({ isFetching: true })
    var tkeranjanglist = this.state.keranjanglist;
    var tuser = this.state.user;
    if (tuser == null)
      tuser = await getData("user");
    var ttotalharga = 0;
    var ttotalproduk = 0;
    var selected = null;
    tkeranjanglist.forEach(function (obj) {

      if (obj.produkid === item.produkid) {
        selected = obj;
        obj.stok = obj.stok - 1;
        if (obj.stok == 0)
          obj.dlt = true;
      }
      ttotalproduk = ttotalproduk + 1;
      ttotalharga = ttotalharga + (obj.stok * obj.harga);
    });
    console.log(tkeranjanglist.length);

    //this.setState({ keranjanglist: tkeranjanglist, totalharga: ttotalharga, totalproduk: ttotalproduk, refresh: !this.state.refresh, isFetching: false });
    firebase
      .database()
      .ref("keranjang/" + tuser.userid + "/" + item.produkid)
      .set(selected);

    await this.loadChat();
  }

  onDeleteStok = async (item) => {
    this.setState({ isFetching: true })
    var tkeranjanglist = this.state.keranjanglist;
    var tuser = this.state.user;
    if (tuser == null)
      tuser = await getData("user");
    var ttotalharga = 0;
    var ttotalproduk = 0;
    var selected = null;
    tkeranjanglist.forEach(function (obj) {

      if (obj.produkid === item.produkid) {
        selected = obj;
        obj.stok = 0;
        obj.dlt = true;
      }
      ttotalproduk = ttotalproduk + 1;
      ttotalharga = ttotalharga + (obj.stok * obj.harga);
    });
    console.log(tkeranjanglist.length);

    //this.setState({ totalharga: ttotalharga, totalproduk: ttotalproduk, refresh: !this.state.refresh, isFetching: false });
    firebase
      .database()
      .ref("keranjang/" + tuser.userid + "/" + item.produkid)
      .set(selected);
    await this.loadChat();
  }


  handleConfirm = (date) => {
    this.setState({ DateDisplay: date });
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };

  OnChatDetail = (selectedproduk) => {
    const { navigation } = this.props;
    navigation.push("ChatDetail", { params: selectedproduk });
  };

  loadChat = async () => {


  await  this.setState({ isFetching: true });

    var tuser = this.state.user;
    if (tuser == null) {
      tuser = await getData("user");
    }


    //console.log(tuser);
    var tuserchats = [];
    var ttotalproduk = 0;
    var ttotalharga = 0;
    try {
      await firebase
        .database()
        .ref("userchats/" + tuser.userid + "/")
        .on("value", (snapshot) => {
          console.log(snapshot);
          snapshot.forEach((child) => {
            if (
              child.key != "count" &&
              child.key != "produkmediacount" 
            ) {
              tuserchats.push({
                key: child.key,

                lastmessage: child.val().lastmessage,
                userid: child.val().userid,
                tokoid: child.val().tokoid,
                name: child.val().name,
              });
            }
          });


          this.setState({ userchats: tuserchats, isFetching: false, user: tuser });
          storeData("userchats", tuserchats);
          //console.log(tkeranjanglist);
        });
    } catch (error) {
      //console.error(error);
    }


  };

  _renderProduk = ({ item }) => {
    // if (item == null || item.stok <= 0 || item.dlt == false)
    // return(
    //   <View></View>
    // )
    console.log("render produk");
   


    return (
      <TouchableOpacity onPress={async () => { this.OnChatDetail(item) }}>
        <View
          style={{
            backgroundColor: "white",
            marginTop: 10,
            borderRadius: 10,
            padding: 10,

            marginHorizontal: 10,
            flexDirection: "row",

          }}
        >

          <View style={{ margin: 5, width: 30, height: 30, overflow: 'hidden', borderRadius: 15 }}>
            <Image
              style={{ width: '100%', height: '120%' }}
              source={require("./../assets/Person.jpg")}
            />
          </View>

          <View style={{ flex: 2, }}>
            <Text style={{ fontWeight: "bold", flexWrap: "wrap", marginBottom: 5 }} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={{ marginBottom: 5 }}> {item.lastmessage} </Text>

           
          </View>
        
        </View>
      </TouchableOpacity>
   
    );
  };


  async componentDidMount() {
    var tsuer = await getData("user");
    this.setState({ user: tsuer });
    await this.loadChat();
    this.props.navigation.addListener('focus', this.loadChat)
  
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Pesan</Text>
            <View style={{ marginTop: 20 }}>
              <Icon name={"cart"} size={25} color={"white"} />
            </View>
          </View>


          <View style={{}}>
            <FlatList
              data={this.state.userchats}
              extraData={this.state.refresh}
              style={{
                paddingHorizontal: 0,
                backgroundColor: "#F6F6F6",
                height: HEIGHT - 80
              }}


              contentContainerStyle={{ justifyContent: "space-between" }}
              renderItem={this._renderProduk}
              keyExtractor={(item) => item.key}
              onRefresh={() => this.loadChat()}
              refreshing={this.state.isFetching}
            />

          </View>

        </SafeAreaView>
       
      </View>
    );
  }
}

export default ChatScreen;

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
