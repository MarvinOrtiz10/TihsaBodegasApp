import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  StatusBar,
  View,
  useWindowDimensions,
} from "react-native";
import { Block, Text } from "galio-framework";
import { Input, Switch } from "../../components";
const { width, height } = Dimensions.get("screen");
import Icon from "../../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../constants";
import { setUser } from "../Features/User/UserSlice";
import axios from "axios";
import { Login } from "../../settings/EndPoints";
import ToastNotification from "../../components/ToastNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { AppVersion } from "../../settings/AppSettings";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { is } from "date-fns/locale";

//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = Math.min(width, height) < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;
const Version = AppVersion.Version;
const BACKGROUND_KEY = "app_background";

const LoginCustomer = ({ onLoginSuccess }) => {
  const { width: currentWidth, height: currentHeight } = useWindowDimensions();
  const isLandscape = currentWidth > currentHeight;
  const toastRef = useRef(null);
  const baseUrlLogin = Login.EndPoint;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordarUsuario, setRecordarUsuario] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );
  const passwordRef = useRef();
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const recordarUsuarioValue =
        await AsyncStorage.getItem("recordarUsuario");
      if (recordarUsuarioValue !== null && recordarUsuarioValue !== "false") {
        setRecordarUsuario(true);
      } else {
        setRecordarUsuario(false);
      }

      const usernameValue = await AsyncStorage.getItem("username");
      if (usernameValue !== null && recordarUsuarioValue) {
        setUsername(usernameValue);
      }
    };
    cargarDatosUsuario();
  }, []);
  const toggleRecordarUsuario = async (value) => {
    if (!value) {
      await AsyncStorage.removeItem("username");
      setUsername("");
      setRecordarUsuario(false);
      await AsyncStorage.setItem("recordarUsuario", "false");
    }
    if (value && username) {
      await AsyncStorage.setItem("username", username);
      setRecordarUsuario(true);
      await AsyncStorage.setItem("recordarUsuario", "true");
    } else {
      notificar(
        "top",
        "Ingrese el usuario para recordarlo",
        "error",
        paddingTopNotification,
      );
      await AsyncStorage.removeItem("username");
      setUsername("");
      setRecordarUsuario(false);
      await AsyncStorage.setItem("recordarUsuario", "false");
    }
  };
  const handleUsername = async (text) => {
    setUsername(text);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLoginPress = (event) => {
    setLoading(true);
    // Aquí puedes realizar la lógica de autenticación o enviar los datos al servidor
    event.preventDefault();
    const contraseña = encodeURIComponent(password);
    var data = {
      Usuario: username,
      Password: password,
    };

    if (!username || !password) {
      notificar(
        "top",
        "Ingrese los campos requeridos para inicio de sesión",
        "error",
        paddingTopNotification,
      );
      setLoading(false);
    }
    if (username && password) {
      axios({
        method: "post",
        url: `${baseUrlLogin}`,
        headers: { "content-type": "text/json" },
        data: data,
      })
        .then((response) => {
          var respuesta = response.data;
          if (respuesta.Error == 0) {
            const userData = respuesta.Data;
            dispatch(setUser(userData));
            setUser("");
            setPassword("");
            setLoading(false);
            navigation.navigate("MainTab");
            onLoginSuccess();
          } else {
            notificar(
              "top",
              respuesta.Mensaje,
              "error",
              paddingTopNotification,
            );
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const renderBody = () => {
    return (
    <View style={styles.formContainer}>
  <BlurView
    intensity={10}
    tint="light"
    style={{
      backgroundColor: "rgba(255,255,255,0.25)",
      overflow: "hidden",
      borderRadius: 25,
      alignItems: "center",
      width: isMovil ? (isLandscape ? "60%" : "100%") : "50%",
      height: isMovil ? (isLandscape ? "95%" : "70%") : "90%",
      paddingVertical: 20,
      justifyContent: "center",

    }}
  >
    {/* LOGO */}
    <View
      style={{
        marginBottom:  isMovil ? (isLandscape ? 4 : 20) : 20,
        alignItems: "center",
      }}
    >
      <Image
        source={Images.LogoApp}
        style={{
          width: isMovil ? (isLandscape ? 150 : 200) : 300,
          height: isMovil ? (isLandscape ? 50 : 70) : 120,
          resizeMode: "contain",
        }}
      />
    </View>

    {/* FORM */}
    <View
      style={{
        width: isMovil ? "100%" : "70%",
        paddingHorizontal: 24,
      }}
    >
      <Input
        shadowless
        placeholder="Usuario"
        value={username}
        returnKeyType="next"
        onChangeText={handleUsername}
        iconContent={
          <Icon
            size={16}
            name="user"
            family="antdesign"
            color="#8898AA"
            style={styles.inputIcons}
          />
        }
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <Input
        right
        password
        shadowless
        placeholder="Contraseña"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry={!showPassword}
        iconContent={
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginRight: -15 }}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              size={16}
              color="#8898AA"
              style={styles.inputIcons}
            />
          </TouchableOpacity>
        }
        onSubmitEditing={handleLoginPress}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: isMovil ? (isLandscape ? 4 : 10) : 10,
        }}
      >
        <Text size={isMovil ? 14 : 18} color="#FFFFFF">
          Recordar usuario
        </Text>
        <Switch
          color="success"
          value={recordarUsuario}
          onValueChange={toggleRecordarUsuario}
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleLoginPress}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.textButton}>Ingresar</Text>
        )}
      </TouchableOpacity>
    </View>

    {/* FOOTER */}
    <View style={{ marginTop: isMovil ? (isLandscape ? 4 : 20) : 20,  }}>
      <Text
        style={{
          fontSize: 12,
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Tihsa Bodegas App v{Version}
      </Text>
    </View>
  </BlurView>
</View>
    );
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
        translucent
      />
      {renderBody()}
      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  home: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  logo: {
    zIndex: 3,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputIcons: {
    marginRight: 12,
  },
  createButton: {
    borderRadius: 25,
    height: isMovil ? 45 : 50,
    backgroundColor: "#FED30B",
    padding: 8,
    paddingHorizontal: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: isMovil ? 16 : 20,
  },
  codeFieldRoot: {
    marginVertical: 10,
    width: isMovil ? "100%" : "50%",
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cce0ff",
    //borderColor: "#007AFF",
    textAlign: "center",
    color: "#4D94FF",
  },
  focusCell: {
    //borderColor: "#000",
    borderColor: "#007AFF",
  },
  selectLabel: {
    marginBottom: 0,
    fontSize: 14,
    color: "#4a4a4a",
  },
  label: {
    marginBottom: -3,
    fontSize: 14,
    color: "#4a4a4a",
  },
});
export default LoginCustomer;
