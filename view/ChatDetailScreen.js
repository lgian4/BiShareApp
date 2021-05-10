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
import { Audio, Video } from 'expo-av';
import { GiftedChat } from 'react-native-gifted-chat'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import { Rating, AirbnbRating } from 'react-native-ratings';

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


class ChatDetailScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",
      user: null,
      messages: null,

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
        stok: 0,
        harga: 0
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
      reviewavg: 0
    };
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble = (props) => {
    console.log(props);
    return (
      <View>
        <Video style={styles.video} resizeMode="cover" source={{ uri: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4" }} />
      </View>
    );
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
  onLogin = async () => {
    const { navigation } = this.props;
    navigation.push("Login");
  };
  onLike = async () => {
    var tproduklike = this.state.produklike;
    var tproduk = this.state.produk;
    var tuser = this.state.user;
    tproduklike.islike = !tproduklike.islike;
    if (tproduklike.islike) {
      //this.notify("❤ + 1");
      tproduk.likecount += 1;
    }
    else {
      //this.notify("❤ - 1");
      tproduk.likecount -= 1;
    }
    this.setState({
      produklike: tproduklike,
      produk: tproduk
    });

    try {

      await firebase
        .database()
        .ref("produklike/" + tproduk.produkid + "/" + tuser.userid)
        .set(tproduklike);
      await firebase
        .database()
        .ref("produk/" + tproduk.produkid)
        .set(tproduk);
    } catch (error) {
      console.error(error);
    }


  };
  onKeranjang = async () => {
    var tkeranjang = this.state.keranjang;
    var tproduk = this.state.produk;
    var tuser = this.state.user;
    if (tkeranjang == null || tkeranjang.produkid == "") {
      tkeranjang = {
        key: tproduk.produkid,
        dlt: true,
        produkid: tproduk.produkid,
        userid: tuser.userid,
        mediaurl: this.state.firstmedia,
        produkname: tproduk.produkname,
        stok: 0,
        harga: tproduk.harga
      }
    }
    if (tkeranjang.dlt || tkeranjang.stok <= 0) {
      tkeranjang.dlt = false;
      tkeranjang.stok = 1;
      this.notify("Produk berhasil dimasukkan kedalam keranjang");

      this.setState({
        keranjang: tkeranjang,

      });

      try {

        await firebase
          .database()
          .ref("keranjang/" + tuser.userid + "/" + tproduk.produkid)
          .set(tkeranjang);

      } catch (error) {
        console.error(error);
      }
    }
    else {
      const { navigation } = this.props; navigation.push("Keranjang");
    }



  };

  OnReview = () => {
    const { navigation } = this.props;
    navigation.push("Review", { params: this.state.produk });
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
        mediaurl: "https://firebasestorage.googleapis.com/v0/b/bishare-48db5.appspot.com/o/adaptive-icon.png?alt=media&token=177dbbe3-a1bd-467e-bbee-2f04ca322b5e",
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
            if (i == 0) {
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
      reviewavg: selectedproduk.reviewavg ?? 0,
      produkmedia: tempproduk,
      refresh: !this.state.refresh,
      firstmedia: firstmedia,
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

            this.setState({ produklike: tproduklike });
          }

        });
    } catch (error) {
      //console.error(error);
    }

    try {
      await firebase
        .database()
        .ref("keranjang/" + tuser.userid + "/" + selectedproduk.produkid)
        .on("value", (snapshot) => {
          if (snapshot != null && snapshot.val() != null
          ) {
            tkeranjang = {
              key: snapshot.key,
              dlt: snapshot.val().dlt ?? false,
              produkid: snapshot.val().produkid ?? selectedproduk.produkid,
              userid: snapshot.val().userid ?? tuser.userid,
              mediaurl: firstmedia,
              produkname: selectedproduk.produkname,
              stok: snapshot.val().stok ?? 0,
              harga: selectedproduk.harga
            };

            this.setState({ keranjang: tkeranjang });
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
      tkeranjang = {
        key: selectedproduk.produkid,
        dlt: true,
        produkid: selectedproduk.produkid,
        userid: tuser.userid,
        mediaurl: firstmedia,
        produkname: selectedproduk.produkname,
        stok: 0,
        harga: selectedproduk.harga
      }
    }
    this.setState({ user: tuser, produklike: tproduklike });
    //storeData("produk", tempproduk);

  };

  OnToko = () => {
    const { navigation } = this.props;
    navigation.push("Toko", { params: this.state.produk.tokoid });
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

  async componentDidMount() {
    // var tsuer = await getData("user");
    // this.setState({ user: tsuer });
    // await this.getProduk();
    console.log("detail");
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        },
        {
          _id: 3,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        },
        {
          _id: 4,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        },
        {
          _id: 5,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        },
        {
          _id: 6,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          video: "https://flyreel.blob.core.windows.net/underwriter-video-storage/e591ef04-8146-4586-b80e-e7c032578549.mp4"
        }
      ]
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default ChatDetailScreen;

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
  video: {
    width: 200,
    height: 200
  }
});
