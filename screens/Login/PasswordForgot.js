import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
} from "react-native";
import { Block, Text, Button } from "galio-framework";
import { Input } from "../../components";
const { width, height } = Dimensions.get("screen");
import Icon from "../../components/Icon";
import argonTheme from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../constants";
import axios from "axios";
import Header from "../../components/Header.js";
import {
  AuthUser,
  ValidateTokenUser,
  ForgotPasswordUser,
} from "../../settings/EndPoints";
import ToastNotification from "../../components/ToastNotification";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BlurView } from "expo-blur";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;

const PasswordForgot = () => {
  const toastRef = useRef(null);
  const baseUrlAuthUser = AuthUser.EndPoint;
  const baseUrlValidateTokenUser = ValidateTokenUser.EndPoint;
  const baseUrlForgotPasswordUser = ForgotPasswordUser.EndPoint;
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordState, setPasswordState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [emailSend, setEmailSend] = useState(false);
  const [userError, setUserError] = useState("");

  const handleUsername = async (text) => {
    setUsername(text);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length < 8 || password == "") {
      setPasswordState(false);
    }
  };
  const handlePasswordConfirmChange = (value) => {
    setPasswordConfirm(value);
    if (value !== password) {
      setUserError("Las contraseñas no coinciden");
      setPasswordState(false);
    } else {
      if (value == password && password.length > 7) {
        setPasswordState(true);
        setUserError("");
      } else {
        setPasswordState(false);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const sendEmail = () => {
    if (username) {
      setLoading(true);
      var data = {
        Usuario: username,
      };
      axios({
        method: "post",
        url: `${baseUrlAuthUser}`,
        headers: { "content-type": "text/json" },
        data: data,
      })
        .then((response) => {
          var respuesta = response.data;
          if (respuesta.Error == 0) {
            notificar(
              "top",
              respuesta.Mensaje,
              "success",
              paddingTopNotification
            );
            setEmailSend(true);
          } else {
            notificar(
              "top",
              respuesta.Mensaje,
              "error",
              paddingTopNotification
            );
          }
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      notificar(
        "top",
        "Ingrese el usuario para enviar la información al correo electrónico",
        "error",
        paddingTopNotification
      );
    }
  };
  const validateToken = () => {
    if (token) {
      setLoading(true);
      var data = {
        Usuario: username,
        Token: token,
      };
      axios({
        method: "post",
        url: `${baseUrlValidateTokenUser}`,
        headers: { "content-type": "text/json" },
        data: data,
      })
        .then((response) => {
          var respuesta = response.data;
          if (respuesta.Error == 0) {
            notificar(
              "top",
              respuesta.Mensaje,
              "success",
              paddingTopNotification
            );
            setHasToken(true);
          } else {
            notificar(
              "top",
              respuesta.Mensaje,
              "error",
              paddingTopNotification
            );
          }
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })

        .catch((error) => {
          console.log(error);
        });
    } else {
      notificar(
        "top",
        "Ingrese el token que aparece en el correo electrónico para validarlo.",
        "error",
        paddingTopNotification
      );
    }
  };
  const handleChangePassword = () => {
    if (passwordState) {
      setLoading(true);
      var data = {
        Usuario: username,
        Token: token,
        Password: passwordConfirm,
      };
      axios({
        method: "post",
        url: `${baseUrlForgotPasswordUser}`,
        headers: { "content-type": "text/json" },
        data: data,
      })
        .then((response) => {
          var respuesta = response.data;
          if (respuesta.Error == 0) {
            notificar(
              "top",
              respuesta.Mensaje,
              "success",
              paddingTopNotification
            );
            setTimeout(() => {
              navigation.navigate("Login");
            }, 5000);
          } else {
            notificar(
              "top",
              respuesta.Mensaje,
              "error",
              paddingTopNotification
            );
          }
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      notificar(
        "top",
        "Las contraseñas no coinciden, ingreselas nuevamente y vuelva a intentarlo.",
        "error",
        paddingTopNotification
      );
    }
  };
  const renderHeader = () => {
    return (
      <Header back scrollTittle={false} title={"Recuperar contraseña"} blur />
    );
  };
  const handleChangeToken = (inputValue) => {
    if (inputValue.length <= 6) {
      setToken(inputValue.charAt(0).toLowerCase() + inputValue.slice(1));
    } else {
      //setToken(inputValue);
    }
  };
  const renderBody = () => {
    return (
      <BlurView intensity={10} tint="light" style={styles.formContainer}>
        <BlurView intensity={30} tint="dark" style={{ flex: 1 }}>
          <Block middle style={{ marginVertical: 20 }}>
            <Image
              source={Images.TihsaLogoMini}
              style={{ width: 50, height: 50 }}
            />
          </Block>
          {emailSend ? (
            hasToken ? (
              <Block
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  alignItems: "center",
                }}
              >
                <Block style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 24, color: "white" }}>
                    Cambio de contraseña
                  </Text>
                </Block>
                <Block
                  width={width}
                  style={{ paddingHorizontal: 16, marginBottom: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    La contraseña debe contener almenos 6 dígitos y un carácter
                    especial.
                  </Text>
                </Block>
                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                  <Text style={styles.label}>Contraseña:</Text>
                  <Input
                    password
                    shadowless
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    error={!passwordState}
                    success={passwordState}
                    iconContent={
                      <Icon
                        size={16}
                        name={showPassword ? "eye" : "eyeo"}
                        family="antdesign"
                        color="#8898AA"
                        style={styles.inputIcons}
                        onPress={togglePasswordVisibility}
                      />
                    }
                  />
                </Block>
                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                  <Text style={styles.label}>Confirmación de contraseña:</Text>
                  <Input
                    password
                    shadowless
                    placeholder="Confirmación de contraseña"
                    value={passwordConfirm}
                    onChangeText={handlePasswordConfirmChange}
                    secureTextEntry={!showPassword}
                    error={!passwordState}
                    success={passwordState}
                    iconContent={
                      <Icon
                        size={16}
                        name={showPassword ? "eye" : "eyeo"}
                        family="antdesign"
                        color="#8898AA"
                        style={styles.inputIcons}
                        onPress={togglePasswordVisibility}
                      />
                    }
                  />
                  {userError !== "" && (
                    <Text style={styles.required}>{userError}</Text>
                  )}
                </Block>
                <Block style={{ flex: 1, justifyContent:"center", maxHeight: 100 }}>
                  <Button
                    color="success"
                    style={styles.createButton}
                    onPress={handleChangePassword}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.textButton}>Cambiar contraseña</Text>
                    )}
                  </Button>
                </Block>
              </Block>
            ) : (
              <Block
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  alignItems: "center",
                }}
              >
                <Block style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 24, color: "white" }}>
                    Token de autenticación
                  </Text>
                </Block>
                <Block
                  width={width}
                  style={{ paddingHorizontal: 16, marginBottom: 15 }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Ingrese el token recibido en su correo electrónico para
                    verificar la propiedad del usuario.
                  </Text>
                </Block>
                <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                  <Input
                    shadowless
                    placeholder="Token"
                    value={token}
                    returnKeyType="next"
                    onChangeText={handleChangeToken}
                    iconContent={
                      <FontAwesomeIcon
                        icon={"lock"}
                        size={16}
                        color="#8898AA"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>

                <Block style={{flex: 1, justifyContent:"center", maxHeight: 100 }}>
                  <Button
                    color="info"
                    style={styles.createButton}
                    onPress={validateToken}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.textButton}>Validar Token</Text>
                    )}
                  </Button>
                </Block>
              </Block>
            )
          ) : (
            <Block
              style={{ flex: 1, paddingHorizontal: 16, alignItems: "center" }}
            >
              <Block style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 24, color: "white" }}>
                  Restablecer su contraseña
                </Text>
              </Block>
              <Block
                width={width * 0.9}
                style={{ paddingHorizontal: 16, marginBottom: 15 }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Ingrese su usuario y le enviaremos un correo para restablecer
                  su contraseña.
                </Text>
              </Block>
              <Block width={width * 0.9} style={{ marginBottom: 15 }}>
                <Input
                  shadowless
                  placeholder="Ingrese su usuario"
                  value={username}
                  returnKeyType="next"
                  onChangeText={handleUsername}
                  iconContent={
                    <FontAwesomeIcon
                      icon={"user-shield"}
                      size={16}
                      color="#8898AA"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>

              <Block style={{flex: 1, justifyContent: "center", maxHeight: 100 }}>
                <Button
                  color="info"
                  style={styles.createButton}
                  onPress={sendEmail}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.textButton}>Enviar correo</Text>
                  )}
                </Button>
              </Block>
            </Block>
          )}
        </BlurView>
      </BlurView>
    );
  };
  return (
    <ImageBackground source={Images.BlueReverse} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
        translucent
      />
      {renderHeader()}
      {renderBody()}
      <ToastNotification ref={toastRef} />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  home: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: "white",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)", //"rgba(0, 0, 0, 0.0)", // Fondo oscuro transparente
  },
  label: {
    fontSize: 14,
    color: "white",
  },
  toastContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  socialConnect: {
    borderColor: "#8898AA",
  },
  containerheaderText: {
    marginTop: 20,
    marginBottom: 20,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "bottom",
    alignItems: "bottom",
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "transparent",
    borderBottomColor: "#FFFFFF",
    borderTopColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 25,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    //elevation: 1,
  },
  biometricIconButton: {
    color: argonTheme.COLORS.INFO,
    marginTop: 2,
    marginRight: 5,
  },
  biometricsTextButtons: {
    color: argonTheme.COLORS.INFO,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.7,
    marginTop: 25,
    borderRadius: 25,
    height: isMovil ? 45 : 50,
  },
  required: {
    marginTop: 0,
    fontSize: 12,
    color: "red",
  },
  textButton: {
    color: "white",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    fontWeight: "bold",
    fontSize: isMovil ? 16 : 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default PasswordForgot;
