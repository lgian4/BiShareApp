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
      produk : {
        "deskripsi": "MAYONETTE Lolly Sling Bag Womens ini hadir dengan berbagai kelebihan yang bisa ditawarkan dalam sebuah tas. Terbuat dari material kulit sintetis, tas ini tampil dalam desain minimalis Korean style yang dapat meningkatkan rasa percaya diri Anda selama beraktivitas. Hadir dengan satu buah kompartemen, Mayonette Lolly Sling sempurna untuk Anda yang ingin tampil chic dan gaya.",
        "harga": "65000",
        "key": "7",
        "produkcode": "Tas Fashion Wanita",
        "produkid": 7,
        "produkmedia":  {
          "7": {
            "dlt": false,
            "mediadate": "2021-04-08 08:27:56",
            "mediaext": "jpg",
            "mediaid": 7,
            "medianama": "7.jpg",
            "mediasize": 145407,
            "mediatype": "image",
            "mediaurl": "https://bishare-48db5.appspot.com.storage.googleapis.com/Produk/7/7.jpg",
            "produkid": 7,
          },
          "8":  {
            "dlt": false,
            "mediadate": "2021-04-08 08:28:18",
            "mediaext": "jpg",
            "mediaid": 8,
            "medianama": "8.jpg",
            "mediasize": 143605,
            "mediatype": "image",
            "mediaurl": "https://bishare-48db5.appspot.com.storage.googleapis.com/Produk/7/8.jpg",
            "produkid": 7,
          },
          "9":  {
            "dlt": false,
            "mediadate": "2021-04-08 08:28:37",
            "mediaext": "jpg",
            "mediaid": 9,
            "medianama": "9.jpg",
            "mediasize": 119101,
            "mediatype": "image",
            "mediaurl": "https://bishare-48db5.appspot.com.storage.googleapis.com/Produk/7/9.jpg",
            "produkid": 7,
          },
        },
        "produkname": "Mynt By Mayonette Lolly Sling Bag - Womens Sling Bag - Tas Fashion Wanita",
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

  getProduk = async() =>{
    const { navigation,route } = this.props;
    const { params: selectedproduk } = route.params;
console.log(selectedproduk);
    this.setState({produk:selectedproduk})
  }

  componentDidMount(){
    this.getProduk()
  }

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
              paddingTop: 10,
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Icon name={"chevron-back-outline"} size={25} color={"#666872"} />
            </View>

            <View style={{ marginTop: 20 }}>
              <Icon name={"cart"} size={25} color={"#666872"} />
            </View>
          </View>
          
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text
              style={{ fontSize: 14, color: "#F24E1E", fontWeight: "bold" }}
            >
              Rp. 20.000
            </Text>
            <Text style={{ fontSize: 28, color: "black", fontWeight: "bold" }}>
              {this.state.produk.produkname}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 16, color: "black" }}>Gambaran</Text>
                  <View
                    style={{
                      backgroundColor: "#F24E1E",
                      height: 3,
                      marginTop: 10,
                      width: 25,
                    }}
                  ></View>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 16, color: "black" }}>Fitur</Text>
                  <View
                    style={{
                      backgroundColor: "#F24E1E",
                      height: 3,
                      marginTop: 10,
                      width: 25,
                    }}
                  ></View>
                </View>
                <View style={{ alignItems: "center" }}>
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
              </View>
              <View style={{alignItems:'center',margin:20}}>
                <Image
                  source={require("./../assets/produk.png")}
                  style={{
                    width: WIDTH * 0.7,

                    borderWidth: 1,
                    borderRadius: 50,
                    borderColor: "black",
                  }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={{}}>
                Unit speaker berisi diafragma yang dikembangkan secara presisi dari bio-selulosa NAC Audio, membuatnya lebih kaku, lebih ringan, dan lebih kuat daripada unit speaker PET biasa, dan memungkinkan diafragma penghasil suara bergetar tanpa tingkat distorsi yang ditemukan di speaker lain.
                </Text>
                <Text style={{}}>
                Unit speaker berisi diafragma yang dikembangkan secara presisi dari bio-selulosa NAC Audio, membuatnya lebih kaku, lebih ringan, dan lebih kuat daripada unit speaker PET biasa, dan memungkinkan diafragma penghasil suara bergetar tanpa tingkat distorsi yang ditemukan di speaker lain.
                </Text>

              </View>
            </View>
          </View>
          <View  style={          
          {
            bottom: -100,
            alignItems:'center',
            justifyContent:'space-evenly',
            width:WIDTH,
            flexDirection:'row',
            position:'absolute',
            
            
          } }>
            <TouchableOpacity
              style={{
                
                height: 45,
                borderRadius: 10,
                fontSize: 16,
                borderColor: "#F24E1E",
                borderWidth:1,
                justifyContent: "space-evenly",
                flexDirection:'row',
                backgroundColor:'white',
                marginTop: 20,
                paddingHorizontal:10,
                
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,  
                elevation: 5
              }}
            >
              <Icon name={'heart-outline'} size={25} color={'#666872'} style={{color:'#F24E1E',marginTop:10}} />
              <Text style={[styles.text,{color: "#F24E1E",marginTop:10}]}>Favorit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
               
                height: 45,
                borderRadius: 10,
                fontSize: 16,
                backgroundColor: "#F24E1E",
                justifyContent: "center",
                marginTop: 20,
                paddingHorizontal:10,
                
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,  
                elevation: 5
              }}
            >
              <Text style={styles.text}>Masukkan Ke Keranjang</Text>
            </TouchableOpacity>
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
 
  btnEye: {
    position: "absolute",
    top: 8,
    right: 37,
  },
});
