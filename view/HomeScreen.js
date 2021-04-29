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
    //   this.notify(e);
    return;
  }
};

const defaultOptions = {
  significantDigits: 2,
  thousandsSeparator: '.',
  decimalSeparator: ',',
  symbol: 'Rp'
}

const currencyFormatter = (value, options) => {
  console.log("currencyFormatter");
  console.log(typeof value);
  if (typeof value != "number") {
    value = parseInt(value);
  }
  if (typeof value !== 'number') value = 0.0
  options = { ...defaultOptions, ...options }
  value = value.toFixed(options.significantDigits)

  const [currency, decimal] = value.split('.')
  return `${options.symbol} ${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator
  )}`
}

class ProdukDetailScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      showPass: true,
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",
      nama: "",
      alamatLengkap: "",
      email: "",
      password: "",
      konfirmasiPassword: "",
      nomorHP: "",
      kategori: [],
      produk: [],
      viewproduk: [],
      refresh: true,
      refreshkategori: true,
      user: [],
      rekomendasi: [],
      rekomendasikey: [],
      searchtext: "",
      connected: false,
      loadddate: null,
      isFetching: true,
      selectedkategori: "Rekomendasi",
    };
  }

  showPass = async () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };
  LoadData = async () => {
    console.log("1. load data");

    console.log("log");
    this.setState({ isFetching: true });

    var tuser = await getData("user");
    if (tuser == null || tuser.userid == "") {
      const { navigation } = this.props;
      navigation.navigate("RegisterTab");
      return;
    }
    this.setState({ user: tuser });
    this.setState({ nama: tuser.nama });

    var tloadddate = await getData("loadddate");
    this.setState({ loadddate: tloadddate });

    await this.CekKoneksi();
    console.log(this.state.connected);
    if (this.state.connected) {
      console.log("load data");
      await this.loadKategori();
      await this.loadRekomendasi();
      await this.loadProduk();
    } else {
      var tkategori = await getData("kategori");
      this.setState({ kategori: tkategori });
      var trekomendasi = await getData("rekomendasi");
      this.setState({ rekomendasi: trekomendasi });
      var trekomendasikey = await getData("rekomendasikey");
      this.setState({ rekomendasikey: trekomendasikey });
      var tproduk = await getData("produk");
      this.setState({ produk: tproduk });

    }
    this.setState({ isFetching: false });
    await this.loadProdukKategori(this.state.selectedkategori ?? "Rekomendasi");
  };

  onRefresh() {
    this.LoadData();
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


  CekKoneksi = async () => {
    firebase
      .database()
      .ref("info/connected")
      .on("value", (snapshot) => {
        if (snapshot.val() == true) {
          this.setState({ connected: true });
        } else {
          this.setState({ connected: false });
        }
      });
  };

  loadKategori = async () => {
    if (this.state.kategori == null || this.state.kategori.length <= 3) {
      var tempkategori = [];
      console.log("load kategori");

      firebase
        .database()
        .ref("kategori/")
        .on("value", (snapshot) => {
          tempkategori.push({
            key: "Rekomendasi",
            kategoricode: "Rekomendasi",
            kategoridesc: "Rekomendasi",
            kategoriid: "Rekomendasi",
            kategoriname: "Rekomendasi",
          });
          tempkategori.push({
            key: "All",
            kategoricode: "All",
            kategoridesc: "All",
            kategoriid: "All",
            kategoriname: "All",
          });

          snapshot.forEach((child) => {
            if (child.key != "count" && child.val().dlt != true) {
              tempkategori.push({
                key: child.key,
                kategoricode: child.val().kategoricode,
                kategoridesc: child.val().kategoridesc,
                kategoriid: child.val().kategoriid,
                kategoriname: child.val().kategoriname,
              });
            }
          });
        });
      this.setState({ kategori: tempkategori });
      await storeData("kategori", tempkategori);

      this.setState({ refreshkategori: !this.state.refreshkategori });
    }
  };
  loadRekomendasi = async () => {
    if (this.state.rekomendasi == null || this.state.rekomendasi.length == 0) {

      console.log("load rekomendasi");
      var temprekomendasi = [];
      var temprekomendasikey = [];
      firebase
        .database()
        .ref("rekomendasi/")
        .on("value", (snapshot) => {
          snapshot.forEach((child) => {
            if (child.key != "count" && child.val().dlt != true) {
              temprekomendasikey.push(child.val().produkid);
              temprekomendasi.push({
                key: child.key,
                produkid: child.val().produkid,
                produkname: child.val().produkname,
                rekomendasiid: child.val().rekomendasiid,
              });
            }
          });

          console.log(temprekomendasi);
          this.setState({ rekomendasi: temprekomendasi });
          this.setState({ rekomendasikey: temprekomendasikey });

        });
      await storeData("rekomendasi", this.state.rekomendasi);
      await storeData("rekomendasikey", this.state.rekomendasikey);
    }
  };

  loadProdukKategori = async (kategori) => {
    if (this.state.produk.length <= 0) {
      return;
    }
    var tproduk = this.state.produk;
    console.log("load produk kategori");
    console.log(kategori);
    this.setState({ isFetching: true });
    this.setState({ selectedkategori: kategori });
    if (kategori == "All") {
      this.setState({ viewproduk: tproduk });

    } else if (kategori == "Rekomendasi") {
      var tempproduk = [];
      console.log(this.state.rekomendasikey);

      tempproduk = tproduk.filter(item => this.state.rekomendasikey.includes(item.produkid.toString()));
      console.log(tempproduk.length);

      this.setState({ viewproduk: tempproduk });
    } else {

      var tempproduk = [];
      console.log(typeof tproduk);
      tempproduk = tproduk.filter(obj => {
        return obj.kategoriid == kategori
      })
      // for (var i = 0; i < this.state.produk.length; i++) {
      //   if (this.state.produk[i].kategoriid == this.state.selectedkategori) {
      //     tempproduk.push(this.state.produk[i]);
      //   }
      // }
      console.log(tempproduk.length);

      this.setState({ viewproduk: tempproduk });
    }

    console.log("console.log(this.state.viewproduk.length :" + this.state.viewproduk.length.toString());
    this.setState({ refresh: !this.state.refresh });
    this.setState({ isFetching: false });

  };
  loadProduk = async () => {
    console.log("load produk");
    var tempproduk = [];
    this.setState({ refresh: !this.state.refresh });
    if (this.state.produk == null || this.state.produk.length <= 0 || true) {
      await firebase
        .database()
        .ref("produk/")
        .on("value", (snapshot) => {
          snapshot.forEach((child) => {
            if (
              child.key != "count" &&
              child.key != "produkmediacount" &&
              child.val().dlt != true
            ) {
              tempproduk.push({
                key: child.key,
                produkcode: child.val().produkcode,
                deskripsi: child.val().deskripsi,
                fitur: child.val().fitur,
                spesifikasi: child.val().spesifikasi,
                stok: child.val().stok,
                produkid: child.val().produkid,
                produkname: child.val().produkname,
                harga: child.val().harga,
                produkmedia: child.val().produkmedia ?? null,
                kategoriid: child.val().kategoriid,
                kategoriname: child.val().kategoriname,
                tokoid: child.val().tokoid,
                tokoname: child.val().tokoname,
                stok: child.val().stok,
                produkdate: child.val().produkdate,
                produkcode: child.val().produkcode,
                dlt: child.val().dlt ?? false,
                produkmediacount: child.val().produkmediacount ?? 0,
                status: child.val().status ?? "",
                likecount: child.val().likecount ?? 0,
              });
            }
          });


          this.setState({ produk: tempproduk });
          storeData("produk", tempproduk);
        });


    }
  };
  onSubmit = async () => {
    const { navigation } = this.props;
  };
  showDatePicker = () => {
    this.setState({ visibility: true });
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
  onSearch = () => {
    const { navigation } = this.props;
    navigation.navigate("Search");
  };

  onLogin = async () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  OnProdukDetail = (selectedproduk) => {
    const { navigation } = this.props;
    navigation.navigate("ProdukDetail", { params: selectedproduk });
  };

  onLogout = async () => {
    const { navigation } = this.props;

    try {
      await storeData("user", null);
      navigation.navigate("RegisterTab");
    } catch (error) {
      console.error(error);
    }
  };
  _renderItem = ({ item }) => {
    var backcolor = "white";
    var fontcolor = "black";
    if (item.kategoriid == this.state.selectedkategori) {
      backcolor = "#F24E1E";
      fontcolor = "white";
    }
    return (
      <TouchableOpacity
        onPress={async (xitem) => {
          console.log("change kategori");
          console.log(item.kategoriid);

          this.loadProdukKategori(item.kategoriid);
          this.setState({
            selectedkategori: item.kategoriid,
            refresh: !this.state.refresh,
            refreshkategori: !this.state.refreshkategori
          });


        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 9,
            borderRadius: 20,
            backgroundColor: backcolor,
            marginHorizontal: 7,
          }}
        >
          <Text style={{ color: fontcolor }}>{item.kategoriname}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  _renderProduk = ({ item }) => {
    console.log("render produk");
    var uriimage =
      "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e";
    var fill = false;
    if (item.produkmedia == null) {
    } else if (typeof item.produkmedia === "object") {
      if (
        Object.keys(item.produkmedia) != null &&
        Object.keys(item.produkmedia).length >= 1
      ) {
        Object.values(item.produkmedia).forEach(function (produkmedia) {
          if (
            produkmedia != null &&
            produkmedia.dlt == false &&
            produkmedia.mediaurl != "" &&
            fill == false
          ) {
            uriimage = produkmedia.mediaurl;
            fill = true;
          }
        });
      }
    }

    return (
      <TouchableOpacity onPress={() => this.OnProdukDetail(item)}>
        <View
          style={{
            width: WIDTH / 2.5,
            backgroundColor: "white",
            marginTop: 10,
            borderRadius: 10,
            alignSelf: "flex-start",
            padding: 10,
            marginHorizontal: 10,


          }}
        >
          <Image
            source={{ uri: uriimage }}
            resizeMode="contain"
            style={{ height: 100, borderRadius: 20, alignItems: "center", }}
          />
          <Text
            style={{ fontWeight: "bold", flexWrap: "wrap" }}
            numberOfLines={1}
          >
            {item.produkname}
          </Text>
          <Text> {currencyFormatter(item.harga)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  componentDidMount() {
    //this.setState({ refresh: true });
    this.setState({ selectedkategori: "Rekomendasi" });
    this.LoadData();

  }
  componentWillUnmount() { }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            <View style={{}}>
              <Image
                source={require("./../assets/logo.png")}
                style={{ height: 50, alignContent: "flex-start", width: 50 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={this.onLogout}>
                <Icon name={"ios-person"} size={25} color={"#666872"} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
            <Text style={{ fontSize: 16 }}>Hi, {this.state.nama ?? ""}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={this.onSearch}>


              <TextInput
                style={styles.input}
                onChangeText={(val) => this.setState({ searchtext: val })}
                placeholder={"Search "}
                placeholderTextColor={"#666872"}
                underlineColorAndroid="transparent"

                editable={false}

              />
              <Icon
                name={"search"}
                size={25}
                color={"#666872"}
                style={styles.inputIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#F6F6F6",

              marginTop: 10,
              borderRadius: 20,
              paddingVertical: 10,
              alignContent: "space-between",
            }}
          >
            <FlatList
              data={this.state.kategori}
              extraData={this.state.refreshkategori}
              style={{ height: 50, flexGrow: 0, alignContent: 'center' }}
              horizontal={true}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.kategoriid.toString()}
            />
          </View>
        </SafeAreaView>
        <FlatList
          data={this.state.viewproduk}
          extraData={this.state.refresh}
          style={{
            paddingHorizontal: 10,
            marginTop: -20,
            backgroundColor: "#F6F6F6",
          }}
          scrollEnabled={true}
          numColumns={2}
          contentContainerStyle={{ justifyContent: "space-between" }}
          renderItem={this._renderProduk}
          keyExtractor={(item) => item.produkid}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
        />
      </View>
    );
  }
}

export default ProdukDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    height: HEIGHT,
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
  inputIcon: {
    position: "absolute",
    borderColor: "#666872",
    top: 8,
    left: 37,
    paddingRight: 5,
  },
  btnEye: {
    position: "absolute",
    top: 8,
    right: 37,
  },
});
