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

     await this.loadKeranjang();
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

      await this.loadKeranjang();
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
    await this.loadKeranjang();
  }


  handleConfirm = (date) => {
    this.setState({ DateDisplay: date });
    this.setState({ visibility: false });
    this.setState({ TextInputDisableStatus: true });
  };

  OnProdukDetail = async (selectedproduk) => {
    const { navigation } = this.props;
    var tempproduk = null;
    await firebase
      .database()
      .ref("produk/" + selectedproduk.produkid)
      .on("value", (snapshot) => {

        tempproduk = {
          key: snapshot.key,
          produkcode: snapshot.val().produkcode,
          deskripsi: snapshot.val().deskripsi,
          fitur: snapshot.val().fitur,
          spesifikasi: snapshot.val().spesifikasi,
          stok: snapshot.val().stok,
          produkid: snapshot.val().produkid,
          produkname: snapshot.val().produkname,
          harga: snapshot.val().harga,
          produkmedia: snapshot.val().produkmedia ?? null,
          kategoriid: snapshot.val().kategoriid,
          kategoriname: snapshot.val().kategoriname,
          tokoid: snapshot.val().tokoid,
          tokoname: snapshot.val().tokoname,
          stok: snapshot.val().stok,
          produkdate: snapshot.val().produkdate,
          produkcode: snapshot.val().produkcode,
          dlt: snapshot.val().dlt ?? false,
          produkmediacount: snapshot.val().produkmediacount ?? 0,
          status: snapshot.val().status ?? "",
          likecount: snapshot.val().likecount ?? 0,
        };
      });

    navigation.push("ProdukDetail", { params: tempproduk });
  };

  loadKeranjang = async () => {


    this.setState({ isFetching: true });

    var tuser = this.state.user;
    if (tuser == null) {
      tuser = await getData("user");
    }


   // console.log(tuser);
    var tkeranjanglist = [];
    var ttotalproduk = 0;
    var ttotalharga = 0;
    try {
      await firebase
        .database()
        .ref("keranjang/" + tuser.userid + "/")
        .on("value", (snapshot) => {
          //console.log(snapshot);
          snapshot.forEach((child) => {
            if (
              child.key != "count" &&
              child.key != "produkmediacount" &&
              child.val().dlt != true,
              child.val().stok >= 1
            ) {
              ttotalproduk = ttotalproduk + 1;
              ttotalharga = ttotalharga + (child.val().stok * child.val().harga);
              tkeranjanglist.push({
                key: child.key,
                dlt: child.val().dlt,
                produkid: child.val().produkid,
                userid: child.val().userid,
                mediaurl: child.val().mediaurl,
                produkname: child.val().produkname,
                stok: child.val().stok,
                harga: child.val().harga,
              });
            }
          });

          console.log(tkeranjanglist.length)
          this.setState({ keranjanglist: tkeranjanglist, totalproduk: ttotalproduk, totalharga: ttotalharga, isFetching: false, user: tuser });
          storeData("keranjanglist", tkeranjanglist);
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
    var uriimage =
      "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e";
    var fill = false;
    if (item.mediaurl != null && item.mediaurl != "") {
      uriimage = item.mediaurl
    }


    return (
      <TouchableOpacity onPress={async () => { this.OnProdukDetail(item) }}>
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

          <View style={{ marginRight: 10, width: 80, backgroundColor: "#F6F6F6", height: 80, overflow: 'hidden', borderRadius: 10 }}>
            <Image
              style={{ width: '100%', height: '100%' }}
              resizeMode={"contain"}
              source={{ uri: uriimage }}
            />
          </View>

          <View style={{ flex: 2, }}>
            <Text style={{ fontWeight: "bold", flexWrap: "wrap", marginBottom: 5 }} numberOfLines={1}>
              {item.produkname}
            </Text>
            <Text style={{ marginBottom: 5 }}> {currencyFormatter(item.harga)} </Text>

            <View style={{ flexDirection: "row" }}>
              <View style={{ borderWidth: 2, borderColor: "#F6F6F6", borderRadius: 10 }}>
                <TouchableOpacity onPress={async () => { this.onMinusStok(item) }}>
                  <Icon name={"remove-outline"} size={25} color={"black"} />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>{item.stok}</Text>
              <View style={{ borderWidth: 2, borderColor: "#F6F6F6", borderRadius: 10 }}>
                <TouchableOpacity onPress={async () => { this.onAddStok(item) }}>
                  <Icon name={"add-outline"} size={25} color={"black"} />
                </TouchableOpacity>

              </View>

            </View>
          </View>
          <View style={{ flex: 0.5, justifyContent: "center" }}>
            <TouchableOpacity  onPress={async () => { this.onDeleteStok(item) }}>
              <Icon name={"trash-outline"} style={{ alignSelf: "flex-end" }} size={25} color={"red"} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  componentDidMount() {
    var tsuer = getData("user");
    this.setState({ user: tsuer });
    this.loadKeranjang();
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Keranjang Belanjaan</Text>
            <View style={{ marginTop: 20 }}>
              <Icon name={"cart"} size={25} color={"white"} />
            </View>
          </View>


          <View style={{}}>
            <FlatList
              data={this.state.keranjanglist}
              extraData={this.state.refresh}
              style={{
                paddingHorizontal: 10,
                backgroundColor: "#F6F6F6",
                height: HEIGHT - 80
              }}


              contentContainerStyle={{ justifyContent: "space-between" }}
              renderItem={this._renderProduk}
              keyExtractor={(item) => item.produkid.toString()}
              onRefresh={() => this.loadKeranjang()}
              refreshing={this.state.isFetching}
            />

          </View>

        </SafeAreaView>
        <View style={{ position: "absolute", bottom: 0, padding: 15, flexDirection: 'row', alignContent: "space-between", width: WIDTH, backgroundColor: "white", borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: 20 }}>
          <Text style={{ flex: 1, textAlign: "left" }}>Total {this.state.totalproduk} Barang</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1, textAlign: "right" }}>{currencyFormatter(this.state.totalharga)}</Text>
        </View>
      </View>
    );
  }
}

export default KeranjangScreen;

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
