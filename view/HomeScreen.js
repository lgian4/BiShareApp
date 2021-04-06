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

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

class HomeScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      showPass: true,
      press: false,
      visibility: false,
      DateDisplay: "",
      TextInputDisableStatus: true,
      displayFormat: "YYYY-MM-DD",
      namaLengkap: "",
      alamatLengkap: "",
      email: "",
      password: "",
      konfirmasiPassword: "",
      nomorHP: "",
      kategori: [],
      refresh: true,
    };
  }

  showPass = async () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };
  loadKategori = async () => {
    console.log("kategori length");
    console.log(this.state.kategori.length);

    var tempkategori = [];
    tempkategori.push({
      key: "All",
      kategoricode: "All",
      kategoridesc: "All",
      kategoriid: "All",
      kategoriname: "All",
    });
    tempkategori.push({
      key: "Rekomendasi",
      kategoricode: "Rekomendasi",
      kategoridesc: "Rekomendasi",
      kategoriid: "Rekomendasi",
      kategoriname: "Rekomendasi",
    });
    if (this.state.kategori == null || this.state.kategori.length <= 0) {
      firebase
        .database()
        .ref("kategori/")
        .on("value", (snapshot) => {
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
    }

    if (!this.state.refresh) {
      this.setState({ refresh: true });
    }
    console.log(typeof this.state.kategori);
  };
  onSubmit = async () => {
    const { navigation } = this.props;
  };
  _renderItem = ({ item }) => {
    console.log("render");
    console.log(item);

    // if (this.state.refresh) {
    //   this.setState({ refresh: false });
    // }

    return (
      <TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 9,
            borderRadius: 20,
            backgroundColor: "#F24E1E",
            marginHorizontal: 7,
          }}
        >
          <Text style={{ color: "white" }}>{item.kategoriname}</Text>
        </View>
      </TouchableOpacity>
    );
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
  onLogin = async () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  render() {
    this.loadKategori();
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
            }}
          >
            <View style={{}}>
              <Image
                source={require("./../assets/logo.png")}
                style={{ width: WIDTH / 4 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Icon name={"ios-person"} size={25} color={"#666872"} />
            </View>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 16 }}>Hi, Andrea</Text>
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
          <View
            style={{
              backgroundColor: "#F6F6F6",
              height: HEIGHT,
              marginTop: 10,
              borderRadius: 10,
              paddingVertical: 10,
              alignContent: "space-between",
            }}
          >
            <FlatList
              data={this.state.kategori}
              extraData={this.state.refresh}
              style={{ height: 50, flexGrow: 0 }}
              horizontal={true}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.kategoriid}
            />
            <View
              style={{ flexDirection: "row",flexWrap:'wrap', justifyContent: "space-around",padding:5 }}
            >
              <View
                style={{
                  width: WIDTH / 2.5,
                  backgroundColor: "white",
                  marginTop:10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  padding: 10,
                }}
              >
                <Image
                  source={require("./../assets/produk.png")}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "bold" }}>TMA-2 HD Wireless</Text>
                <Text>Rp. 20.000</Text>
              </View>
              <View
                style={{
                  width: WIDTH / 2.5,
                  backgroundColor: "white",
                  marginTop:10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  padding: 10,
                }}
              >
                <Image
                  source={require("./../assets/produk.png")}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "bold" }}>TMA-2 HD Wireless</Text>
                <Text>Rp. 20.000</Text>
              </View>
              <View
                style={{
                  width: WIDTH / 2.5,
                  backgroundColor: "white",
                  marginTop:10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  padding: 10,
                }}
              >
                <Image
                  source={require("./../assets/produk.png")}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "bold" }}>TMA-2 HD Wireless</Text>
                <Text>Rp. 20.000</Text>
              </View>
              <View
                style={{
                  width: WIDTH / 2.5,
                  backgroundColor: "white",
                  marginTop:10,
                  borderRadius: 10,
                  alignSelf: "flex-start",
                  padding: 10,
                }}
              >
                <Image
                  source={require("./../assets/produk.png")}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "bold" }}>TMA-2 HD Wireless</Text>
                <Text>Rp. 20.000</Text>
              </View>
            </View>
          </View>
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
