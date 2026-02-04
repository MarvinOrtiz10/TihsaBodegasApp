import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header.js";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import argonTheme from "../../constants/Theme";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../components";
import Select2 from "../../components/Select2";
import ToastNotification from "../../components/ToastNotification";
import { Images } from "../../constants";
import Modals from "../../components/Modals.js";
import {
  cajasBySucursal,
  InformacionCaja,
  ListaSelect,
  modificarCaja,
  registrarCaja,
  SelectPOSNeonet,
  sucursales,
} from "../../settings/EndPoints.js";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Device from "expo-device";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;
const BACKGROUND_KEY = "app_background";
const CELL_COUNT = 6;

const AppSettings = () => {
  const userState = useSelector((state) => state.user);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const idCaja = userState.length !== 0 ? userState[0].IdCaja : 3;
  const baseUrlInfoCaja = InformacionCaja.EndPoint;
  const baseUrlSucursales = sucursales.EndPoint;
  const baseUrlCajas = cajasBySucursal.EndPoint;
  const baseUrlRegister = registrarCaja.EndPoint;
  const baseUrlUpdate = modificarCaja.EndPoint;
  const baseUrlSelectPOS = SelectPOSNeonet.EndPoint;
  const [accountState, setAccountState] = useState(0);
  const toastRef = useRef(null);
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [ipPOS, setIpPOS] = useState("");
  const [paxName, setPaxName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle
  );
  const [usuario, setUsuario] = useState(userState[0].Usuario);
  const [caja, setCaja] = useState("");
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [sucursal, setSucursal] = useState("");
  const [optionsSucursal, setOptionsSucursal] = useState([]);
  const [optionsCaja, setOptionsCaja] = useState([]);
  const [optionsPOSNeonet, setOptionsPOSNeonet] = useState([]);
  const [infoCaja, setInfoCaja] = useState([]);
  const [backgroundSelected, setBackgroundSelected] = useState("");
  const [idPOSNeonet, setIdPOSNeonet] = useState(0);

  // Cargar el background guardado al iniciar la app
  useEffect(() => {
    loadBackground();
    verificarNombre();
    cargarInformacion();
  }, []);
  useEffect(() => {
    if (infoCaja && Array.isArray(infoCaja) && infoCaja.length > 0) {
      const deviceName = infoCaja[0].CodigoCaja;
      const BackgroundApi = infoCaja[0].Background;
      const Sucursal = deviceName.slice(0, 3);
      const IdCaja = deviceName.slice(3, 6);
      const Ip = infoCaja[0].IpPosBac;
      const TerminalId = infoCaja[0].TerminalId;
      const OptionIDCaja = infoCaja[0].SelectCaja;
      const IdPOSNeonet = infoCaja[0].PosNeoNet;
      //Desestructurar el nombre del dispositivo
      setSucursal(Sucursal);
      setBackgroundSelected(BackgroundApi? BackgroundApi : "BackgroundDetalle");
      setIpPOS(Ip);
      setPaxName(TerminalId);
      setIdPOSNeonet(IdPOSNeonet?.value);
      setTimeout(() => {
        axios.get(`${baseUrlCajas}/${codEmp}/${Sucursal}`).then((response) => {
          // Asegúrate de combinar los datos, por ejemplo al principio de la lista:
          const opcionesConIDCaja = [OptionIDCaja, ...response.data];
          setOptionsCaja(opcionesConIDCaja);
        });
        setCaja(IdCaja);
      }, 1000);
    }
  }, [infoCaja]);
  const cargarInformacion = () => {
    axios.get(`${baseUrlInfoCaja}/${idCaja}`).then((response) => {
      const respuesta = response.data.Data;
      setInfoCaja([respuesta]);
    });

    axios.get(`${baseUrlSucursales}`).then((response) => {
      setOptionsSucursal(response.data);
    });
    axios.get(baseUrlSelectPOS).then((response) => {
      const respuesta = response.data;
      setOptionsPOSNeonet(respuesta);
    });
  };
  const loadBackground = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem(BACKGROUND_KEY);
      if (savedBackground && Images[savedBackground]) {
        setBackgroundImage(Images[savedBackground]); // Asignar imagen al estado
      }
    } catch (error) {
      console.error("Error cargando el background:", error);
    }
  };
  const verificarNombre = async () => {
    const nombreGuardado = await AsyncStorage.getItem("nombre_dispositivo");
    if (nombreGuardado) {
      setSucursal(nombreGuardado.slice(0, 2));
      setCaja(nombreGuardado.slice(3, 5));
    }
  };
  // Función para cambiar y guardar el background
  const handleChangeBackground = async (newBackground) => {
    setBackgroundSelected(newBackground);
    setBackgroundImage(Images[newBackground]); // Cambiar el fondo visualmente

    try {
      await AsyncStorage.setItem(BACKGROUND_KEY, newBackground); // Guardar el nombre en AsyncStorage
    } catch (error) {
      console.error("Error guardando el background:", error);
    }
  };
  const renderHeader = () => {
    return (
      <Header
        back
        onBackPress={handlePressBack}
        scrollTittle={false}
        title={"Configuración de app"}
        blur
      />
    );
  };
  const handlePressBack = () => {
    if (accountState == 0 || accountState == 3) {
      navigation.goBack();
    } else {
      setAccountState(accountState - 1);
    }
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const handleSelectSucursal = (value) => {
    if (value !== null) {
      setSucursal(value);
      axios.get(`${baseUrlCajas}/1/${value}`).then((response) => {
        setOptionsCaja(response.data);
      });
    } else {
      setSucursal("");
      setOptionsCaja([]);
    }
  };
  const handleSelectCaja = (value) => {
    if (value !== null) {
      setCaja(value);
    } else {
      setCaja("");
    }
  };
  const backgrounds = [
    {
      id: "BackgroundDetalle",
      label: "Tihsa",
      image: Images.BackgroundDetalle,
    },
    {
      id: "BackgroundEmtop",
      label: "Emtop",
      image: Images.BackgroundEmtop,
    },
  ];
  const handleRegistrarCaja = async () => {
    try {
      if (ipPOS.trim() == "") {
        notificar(
          "top",
          "La ip del pos es requerida",
          "error",
          paddingTopNotification
        );
        return;
      }
      if (paxName.trim() == "") {
        notificar(
          "top",
          "El nombre del pos es requerido",
          "error",
          paddingTopNotification
        );
        return;
      }
      if (sucursal.trim() == "") {
        notificar(
          "top",
          "Seleccione una sucursal para continuar",
          "error",
          paddingTopNotification
        );
        return;
      }
      if (caja.trim() == "") {
        notificar(
          "top",
          "Seleccione una caja para continuar",
          "error",
          paddingTopNotification
        );
        return;
      }
      if (sucursal.trim() !== "" && caja.trim() !== "") {
        const deviceName = sucursal.trim() + caja.trim();

        const sucursalSinB = sucursal.replace("B", "");
        const codBodega = parseInt(sucursalSinB, 10);
        const data = {
          CodBodega: codBodega,
          CodEmp: codEmp,
          CodigoCaja: deviceName,
          IpPosBac: ipPOS,
          Background: backgroundSelected,
          Usuario: usuario,
          Activa: true,
          TerminalId: paxName,
          "IdPOSNeoNet": idPOSNeonet,
        };
        //Lógica para hacer la petición POST y guardar la configuración
        const response = await axios.put(`${baseUrlUpdate}/${idCaja}`, data, {
          headers: { "content-type": "text/json" },
        });

        const respuesta = response.data;

        if (respuesta.Error == 0) {
          // Lógica para mostrar un mensaje de éxito
          notificar(
            "top",
            respuesta.Mensaje,
            "success",
            paddingTopNotification
          );

          // Lógica para guardar en AsyncStorage el nombre del dispositivo
          await AsyncStorage.setItem("nombre_dispositivo", deviceName);
        } else {
          notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
        } 
      }
    } catch (error) {
      console.log(error);
    }
  };
  const testConnection = async () => {
    if (ipPOS) {
      try {
        const response = await axios.get(`http://${ipPOS}/venta?monto=100&timeout=60000`, {
          headers: {
            scheme: "https",
            "Content-Type": "application/json",
            "Custom-Header": "valor",
          },
        });
        const respuesta = response.data;
        const responseCode = respuesta.RESPCODE;
        setPaxName(respuesta.TERMINALID);

        if (responseCode === "00") {
          notificar(
            "top",
            `Conexión exitosa`,
            "success",
            paddingTopNotification
          );
        } else {
          notificar(
            "top",
            `Error en el proceso de pago, la conexión con el POS es exitosa `,
            "error",
            paddingTopNotification
          );
        }
      } catch (error) {
        console.error("Error en el proceso de pago:", error);
        notificar(
          "top",
          `"Error en el proceso de pago:", ${error}`,
          "error",
          paddingTopNotification
        );
      }
    } else {
      notificar(
        "top",
        `Ingrese una dirección ip válida para realizar la prueba de conexión`,
        "error",
        paddingTopNotification
      );
    }
  };
  const handleSelectPOSNeonet = (value) => {
    if (value !== null) {
      setIdPOSNeonet(value);
    }
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.home}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={"default"}
        hidden={false}
      />
      {renderHeader()}
      <View style={{ flex: 1, width: width, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            paddingTop: 5,
            justifyContent: "center",
          }}
        >
          <View style={{ flex: isMovil ? 1 : 0.5}}>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              enableOnAndroid
              extraHeight={Iphone ? 0 : 100}
            >
              <View
                style={{
                  backgroundColor: "#DBEAFE",
                  flex: isMovil ? 0 : 1,
                  paddingVertical: 10,
                  borderRadius: 15,
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    color: "#4d9ef4",
                    fontSize: 20,
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Configuración de Dispositivo (Caja)
                </Text>
                <Block middle style={{ marginVertical: 10 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingHorizontal: 16,
                  }}
                >
                  <Block
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.selectLabel}>Sucursal: </Text>
                    <Select2
                      options={optionsSucursal}
                      value={sucursal}
                      setValue={setSucursal}
                      onSelect={handleSelectSucursal}
                      placeholder="- Sucursales -"
                      doneText="Aceptar"
                      iconColor={"#4D94FF"}
                      darkTheme
                    />
                  </Block>
                  {sucursal && (
                    <Block
                      style={{
                        flex: 1,
                        marginLeft: 5,
                      }}
                    >
                      <Text style={styles.selectLabel}>Caja: </Text>
                      <Select2
                        options={optionsCaja}
                        value={caja}
                        setValue={setCaja}
                        onSelect={handleSelectCaja}
                        placeholder="- Cajas -"
                        doneText="Aceptar"
                        iconColor={"#4D94FF"}
                        darkTheme
                      />
                    </Block>
                  )}
                  
                </Block>
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingHorizontal: 16,
                  }}
                >
                <Block
                  style={{ flex: 1 }}
                >
                  <Text style={styles.label}>Background:</Text>
                  <View
                    style={{ flex: 1, flexDirection: "row", marginTop: 10 }}
                  >
                    {backgrounds.map((bg) => {
                      const selected = backgroundSelected === bg.id;
                      return (
                        <View key={bg.id} style={{ padding: 5 }}>
                          <TouchableOpacity
                            onPress={() => handleChangeBackground(bg.id)}
                          >
                            {selected && (
                              <View
                                style={{
                                  width: 80,
                                  position: "absolute",
                                  bottom: 30,
                                  backgroundColor: "#FED30B",
                                  padding: 2,
                                  borderRadius: 5,
                                  zIndex: 1,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#000",
                                    fontSize: 8,
                                    textAlign: "center",
                                  }}
                                >
                                  Seleccionado
                                </Text>
                              </View>
                            )}
                            <Image
                              source={bg.image}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 10,
                                borderWidth: selected ? 3 : 0,
                                borderColor: selected
                                  ? "#FED30B"
                                  : "transparent",
                              }}
                            />

                            <Text
                              style={{
                                width: 80,
                                color: "#007AFF",
                                fontSize: 18,
                                //marginTop: -30,
                                textAlign: "center",
                              }}
                            >
                              {bg.label}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </Block>
                {sucursal && caja && (
                <Block
                  style={{
                    flex: 1,
                    marginLeft: 5,
                  }}
                >
                  <Text style={{ marginBottom: 0 }}>
                    Nombre de Dispositivo:
                  </Text>

                  <CodeField
                    ref={ref}
                    {...props}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={sucursal + caja}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                      <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    )}
                    readOnly
                  />
                </Block>)}
                </Block>
                <Text
                  style={{
                    color: "#4d9ef4",
                    fontSize: 20,
                    textAlign: "center",
                    marginTop: 0,
                  }}
                >
                  Configuración de POS
                </Text>
                <Block middle style={{ marginVertical: 10 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 16,
                  }}
                >
                  <Block style={{ flex: 1, marginRight: 2 }}>
                    <Text style={styles.label}>Ip POS:</Text>
                    <Input
                      right
                      placeholder="Número de ip del POS"
                      value={ipPOS}
                      onChangeText={setIpPOS}
                      iconContent={<></>}
                      success={ipPOS && ipPOS !== "" ? true : false}
                      error={!ipPOS || ipPOS === "" ? true : false}
                    />
                    {(!ipPOS || ipPOS === "") && (
                      <Text style={styles.required}>* Requerido</Text>
                    )}
                  </Block>
                  <Block style={{ flex: 1, marginLeft: 2 }}>
                    <Text style={styles.label}>Nombre del POS:</Text>
                    <Input
                      right
                      placeholder="Nombre del POS"
                      value={paxName}
                      onChangeText={setPaxName}
                      iconContent={<></>}
                      success={paxName && paxName !== "" ? true : false}
                      error={!paxName || paxName === "" ? true : false}
                      editable={false}
                    />
                    {(!paxName || paxName === "") && (
                      <Text style={styles.required}>* Requerido</Text>
                    )}
                  </Block>
                </Block>
                <View style={{  paddingHorizontal: 16, }}>
                  <Text style={styles.selectLabel}>POS Neonet: </Text>
                  <Select2
                    options={optionsPOSNeonet}
                    value={idPOSNeonet}
                    setValue={setIdPOSNeonet}
                    onSelect={handleSelectPOSNeonet}
                    placeholder="- POS -"
                    doneText="Aceptar"
                    iconColor={"#4D94FF"}
                    darkTheme
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingHorizontal: 16,
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 50,
                      backgroundColor: "#25D366",
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                    }}
                    onPress={() => testConnection()}
                  >
                    <FontAwesomeIcon icon={"wifi"} size={14} color="white" />
                    <Text
                      style={{ marginTop: -3, marginLeft: 5, color: "white" }}
                    >
                      Probar conexión
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 50,
                      backgroundColor: "#007AFF",
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                    }}
                    onPress={handleRegistrarCaja}
                  >
                    <FontAwesomeIcon
                      icon={"floppy-disk"}
                      size={14}
                      color="white" // Azul fuerte para el ícono (accesible y destacado)
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        marginLeft: 5,
                      }}
                    >
                      Guardar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
      <Modals
        visible={modal}
        onClose={() => {
          setModal(false);
        }}
        width="45%"
        height="100%"
        renderFooter={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          ></View>
        }
      ></Modals>
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
  search: {
    minHeight: 48,
    borderRadius: 25,
    borderColor: argonTheme.COLORS.BORDER,
  },
  searchContainer: {
    flex: 1,
    borderColor: argonTheme.COLORS.BORDER,
  },
  columnProd: {
    flex: 1,
    paddingHorizontal: 5,
  },
  mainCardView: {
    flex: 1,
    //minHeight: 140,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 8,
    marginTop: 3,
    marginHorizontal: 3,
  },
  productContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: 70,
    height: 70,
  },
  productContainerOutOfStock: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    //elevation: 5,
    width: isMovil ? 70 : 100,
    height: isMovil ? 70 : 100,
    opacity: 0.5,
  },
  productImageCarrousel: {
    width: 70,
    height: 70,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputSpinnerStyle: {
    backgroundColor: "white",
    height: 25,
    width: 100,
    fontSize: 10,
  },
  buttonStyle: {
    height: 25,
    width: 25,
    fontSize: 10,
    backgroundColor: "#007AFF",
  },
  inputStyle: {
    height: 45,
    fontSize: 15,
  },
  circle: {
    width: 25,
    height: 25,
    borderWidth: 2, // Añadimos un ancho de borde
    borderColor: "#007AFF", // Color del borde
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF", // Color del número
  },
  divider: {
    width: "95%",
    borderWidth: 0.5,
    borderColor: "#4d9ef4",
  },

  inputContainer: {
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  labelContainer: {
    marginBottom: 0,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  promedioContainer: {
    marginBottom: 0,
    marginRight: 5,
    padding: 10,
  },
  textContainer: {
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: "#EFEFEF",
  },
  label: {
    marginBottom: -3,
    fontSize: 14,
  },
  selectLabel: {
    marginBottom: -3,
    fontSize: 14,
  },
  required: {
    marginTop: -8,
    fontSize: 10,
    color: "red",
  },
  labelNote: {
    marginTop: 0,
    fontSize: 14,
    color: "#0f334f",
  },
  labelWarning: { marginTop: -8, fontSize: 10, color: "#FB6340" },
  warningSelect: { fontSize: 10, color: "#FB6340" },
  requiredSelect: { marginTop: 5, fontSize: 10, color: "red" },
  descLabel: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  selectLabel: { fontSize: 14, marginBottom: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    //paddingVertical: 5,
    backgroundColor: "white",
  },
  floatingButton: {
    borderRadius: 50,
    height: isMovil ? 45 : 50,
    backgroundColor: "#FED30B",
  },
  cartText: {
    color: "#F0F0F0",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    fontWeight: "bold",
    fontSize: isMovil ? 14 : 20,
    textAlign: "center",
  },

  cartTextError: {
    color: "white",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    fontWeight: "bold",
    fontSize: isMovil ? 14 : 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartTextSend: {
    color: "#F0F0F0",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    fontWeight: "bold",
    fontSize: isMovil ? 14 : 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: 44, // Ajusta la altura según el número de líneas deseado
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: "#CAD1D7",
    borderWidth: 1,
    color: "#525F7F",
    paddingHorizontal: 15,
    paddingTop: Iphone ? 5 : 0,
    paddingBottom: Iphone ? 5 : 0,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 5,
  },

  //Modal Styles
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    paddingBottom: 0,
  },

  modalContent: {
    backgroundColor: "white",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    width: "98%",
    alignItems: "center", // Cambiado a "center" en lugar de "flex-start"
    marginBottom: 0,
    height: Iphone ? height - 55 : height - 100,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between", // Cambio en justifyContent
    alignItems: "flex-end", // Cambio en alignItems
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingVertical: 0,
    backgroundColor: "white",
    width: "100%",
  },
  modalBody: {
    height: "82%",
  },
  modalFooter: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    fontSize: 16,
    color: "#666666",
    paddingBottom: 5,
  },
  elementoDerecha: {
    marginLeft: "auto",
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 15,
  },
  textCartButton: {
    color: "white",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  requestButton: {
    backgroundColor: "#FED30B",
    borderRadius: 50,
    height: 50,
    width: width * 0.9,
  },
  textRequestButton: {
    color: "white", //"#00296b",
    textTransform: "uppercase", // Convierte el texto a mayúsculas
    letterSpacing: 0, // Ajusta el espaciado entre las letras
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  iconCarButton: { fontSize: isMovil ? 16 : 24 },
  bannerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: width - 20,
    height: 100,
  },

  headerText: {
    fontSize: 16,
    color: "#666666",
    paddingBottom: 5,
  },
  circleCloseButton: {
    backgroundColor: "#F2F2F2",
    padding: 3,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "100%",
    height: 4,
    backgroundColor: "#666666",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  elementoDerecha: {
    marginLeft: "auto",
  },

  button: {
    marginBottom: theme.SIZES.BASE,
    //width: width - theme.SIZES.BASE * 2,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.COLORS.WHITE,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.COLORS.MUTED,
  },
  modalDescriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  modalDescriptionColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  modalDescriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalName: {
    fontSize: 16,
    marginBottom: 0,
    maxHeight: 4 * 18, // Altura máxima equivalente a tres filas de texto (suponiendo 18 puntos de altura de línea)
    overflow: "hidden",
  },
  modalPrice: {
    color: theme.COLORS.ERROR,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonAccept: {
    flex: 1,
    borderRadius: 50,
    height: isMovil ? 45 : 50,
    backgroundColor: "#34C759", //"#7cd382", //"#17a998",
  },
  buttonSend: {
    flex: 1,
    borderRadius: 50,
    height: isMovil ? 45 : 50,
    backgroundColor: "#007AFF",
  },
  buttonError: {
    flex: 1,
    borderRadius: 50,
    height: isMovil ? 45 : 50,
    backgroundColor: "#f94144", //"red",
  },
  // Form Style
  paymentButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activePayment: {
    backgroundColor: "#F2F2F2",
    borderColor: "#FED30B",
    borderTopWidth: 2,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textDocument: {
    fontSize: isMovil ? 18 : 24,
    color: "#0f334f",
    paddingLeft: 5,
    textAlign: "center",
  },
  //Estilos para confirmación de código
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30, color: "#666666", marginTop: 16 },
  codeFieldRoot: {
    marginTop: 10,
    width: isMovil ? "100%" : "50%",
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4D94FF",
    textAlign: "center",
    color: "#4D94FF",
    marginHorizontal: 1,
  },
  focusCell: {
    borderColor: "#007AFF",
  },
  modalContainerLoading: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingBottom: 0,
  },
  modalContainerLoadingStock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  modalContentLoadingStock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    width: isMovil ? "75%" : "50%",
    maxHeight: height * 0.3,
    shadowColor: "#f2f2f2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentLoading: {
    flex: 1,
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,

    alignItems: "center", // Cambiado a "center" en lugar de "flex-start"
    maxHeight: isMovil ? height * 0.5 : height * 0.4,
    bottom: 0,
  },
  modalCargando: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 5,
  },
  messageContainer: {
    flex: 1,
    width: "100%",
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTextLoading: {
    fontSize: isMovil ? 18 : 28,
    color: "#007AFF",
    textAlign: "center",
    letterSpacing: 1,
  },
  modalText: {
    fontSize: isMovil ? 16 : 16,
    color: "#25d366",
    textAlign: "center",
    marginBottom: isMovil ? 16 : 24,
    marginTop: -20,
  },
  modalTextError: {
    marginTop: isMovil ? 20 : 24,
    fontSize: isMovil ? 14 : 20,
    color: "red",
    textAlign: "center",
  },
  arrowNext: {
    marginTop: 2,
    justifyContent: "center",
    borderRadius: 50,
    //backgroundColor: "#0F334F",
  },
  fancyContainer: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#EFEFEF",
  },
  fancyDivider: {
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    overflow: "hidden",
  },
  fancyText: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    color: "#000000",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%", // Para dos columnas
    padding: 10,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 100,
  },
  text: {
    marginTop: 8,
    textAlign: "center",
  },
});
export default AppSettings;
