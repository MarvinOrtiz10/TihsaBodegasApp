import { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../../components/Header.js";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Linking,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import argonTheme from "../../../constants/Theme.js";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Input } from "../../../components/index.js";
import Select2 from "../../../components/Select2.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ToastNotification from "../../../components/ToastNotification.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import LottieView from "lottie-react-native";
import ReceiveOrder from "../../../assets/animations/Receive-order.json";
import {
  PickingOrders,
  UpdatePicking,
  consultarNitSAT,
} from "../../../settings/EndPoints.js";
import { Images } from "../../../constants/index.js";
import InputAutoGrowing from "../../../components/InputAutoGrowing.js";
import {
  useGetCustomersQuery,
  useGetVendedoresQuery,
  useGetFormasPagoQuery,
} from "../../../services/Api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCart from "../../../components/OrderCart.js";
import InputSpinner from "react-native-input-spinner";

//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;
const BACKGROUND_KEY = "app_background";

const CheckinOrder = () => {
  const route = useRoute();
  const { order } = route.params;
  const userState = useSelector((state) => state.user);
  const customerState = useSelector((state) => state.order.customer);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const codVendedor = userState.length !== 0 ? userState[0].CodVendedor : 29;
  const codBodega = userState.length !== 0 ? userState[0].CodBodega : 1;
  const adminUser =
    userState.length !== 0 ? (userState[0].Clase == "A" ? true : false) : false;
  const baseUrlNitSat = consultarNitSAT.EndPoint;
  const baseUrlSelectOrder = PickingOrders.EndPoint;
  const baseUrlUpdatePicking = UpdatePicking.EndPoint;
  const {
    data: dataVendedores,
    error: errorVendedores,
    isLoading: loadingVendededores,
  } = useGetVendedoresQuery(codEmp);
  const {
    data: dataFormasPago,
    error: errorFormasPago,
    isLoading: loadingFormasPago,
  } = useGetFormasPagoQuery(codEmp);
  const [codigoCliente, setCodigoCliente] = useState(0);
  const [accountState, setAccountState] = useState(0);
  const [nit, setNit] = useState("");
  const [nitState, setNitState] = useState(false);
  const [nombre, setNombre] = useState("");
  const toastRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [vendedor, setVendedor] = useState(codVendedor);
  const [optionsVendedor, setOptionsVendedor] = useState([]);
  const [formaPago, setFormaPago] = useState(1);
  const [formaPagoLabel, setFormaPagoLabel] = useState("CONTADO");
  const [optionsFormasPago, setOptionsFormasPago] = useState([]);
  const [numOrden, setNumOrden] = useState(0);
  const [status, setStatus] = useState("");
  const [tipoCliente, setTipoCliente] = useState(1);
  const [modalStock, setModalStock] = useState(false);
  const [modalLoadingInfo, setModalLoadingInfo] = useState(false);
  const [urlPDF, setUrlPDF] = useState("");
  const [dpi, setDpi] = useState(0);
  const [dpiValid, setDpiValid] = useState(false);
  const [dpiState, setDpiState] = useState(false);
  const [passport, setPassport] = useState("");
  const [passportState, setPassportState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [infoOrder, setInfoOrder] = useState([]);

  const observacionesRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );
  const [infoSat, setInfoSat] = useState({});
  const [nitFel, setNitFel] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderDetailsChecked, setOrderDetailsChecked] = useState([]);

  const transactionStatus = Object.freeze({
    Loading: "loading",
    Success: "success",
    Error: "error",
  });
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
  useEffect(() => {
    cargarInformacion();
    loadBackground();
  }, []);
  useEffect(() => {
    if (dataVendedores) {
      setOptionsVendedor(dataVendedores.Data);
    }
    if (dataFormasPago) {
      setOptionsFormasPago(dataFormasPago);
    }
  }, [dataVendedores, dataFormasPago]);

  useEffect(() => {
    if (infoOrder.length !== 0) {
      const data = infoOrder[0];
      if (data.Nit) {
        setNitState(true);
      }
      validarNitFel(data.Nit);
      setNumOrden(data.NumOrden);
      setNit(data.Nit);
      setDireccion(data.Direccion);
      setNombre(data.Nombre);
      setCodigoCliente(data.CodigoCliente?.toString());
      setObservaciones(data.Observaciones);
      setVendedor(data.CodigoVendedor.value);
      const maxDescuento = obtenerMaxDescuento(
        optionsVendedor,
        data.CodigoVendedor.value,
      );
      // 🔹 FILTRO DE DETALLES POR PICKING
      const detalles = data.Detalles ?? [];
      const detallesChecked = [];
      const detallesPendientes = [];

      for (const item of detalles) {
        if (item.Picking === true) {
          detallesChecked.push(item);
        } else {
          detallesPendientes.push(item);
        }
      }

      setOrderDetails(detallesPendientes);
      setOrderDetailsChecked(detallesChecked);
      setModalStock(false);
    }
  }, [infoOrder]);
  useEffect(() => {
    if (customerState.length !== 0) {
      setNitState(true);
      setNit(customerState.Nit);
      setDireccion(customerState.Direccion);
      setNombre(customerState.Nombre);
      setCodigoCliente(customerState.CodigoCliente.toString());
      setTipoCliente(customerState.CodTcliente);
    }
  }, [customerState]);
  const cargarInformacion = () => {
    setIsLoading(true);
    axios
      .get(`${baseUrlSelectOrder}/${codEmp}/${order}/${codBodega}`)
      .then((response) => {
        var respuesta = response.data;
        if (respuesta.Error == 0) {
          setInfoOrder([respuesta.Data]);
        }
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  const renderHeader = () => {
    return (
      <Header
        back
        onBackPress={handlePressBack}
        scrollTittle={false}
        title={"PICKING DE PEDIDO"}
        blur
      />
    );
  };
  const handleGoHome = () => {
    navigation.goBack();
  };
  const handlePressBack = () => {
    if (accountState == 0) {
      handleGoHome();
    } else {
      navigation.goBack();
    }
  };
  const notificar = (position, mensaje, tipo, paddingTop) => {
    if (toastRef.current) {
      toastRef.current.show(position, mensaje, tipo, paddingTop);
    }
  };
  const handleSelectFormaPago = (value, label) => {
    if (value == null) {
      setFormaPago([]);
      setFormaPagoLabel("");
    } else {
      setFormaPago(value);
      setFormaPagoLabel(label);
    }
  };
  const handleSelectVendedor = (value) => {
    if (value == null) {
      setVendedor([]);
    } else {
      setVendedor(value);
    }
  };
  const obtenerMaxDescuento = (array, valor) => {
    // Buscar el objeto que coincida con el valor dado
    const objetoEncontrado = array.find((item) => item.value === valor);

    // Retornar maxDescuento si se encuentra el objeto, de lo contrario, retornar 0
    return objetoEncontrado ? objetoEncontrado.maxDescuento : 0;
  };
  const validarNitFel = async (NitParam) => {
    const encodedNit = encodeURIComponent(NitParam);

    if (NitParam) {
      try {
        const response = await axios.get(`${baseUrlNitSat}/${encodedNit}`);
        const respuesta = response.data;
        const respuesta2 = respuesta.Data;

        if (respuesta.Error === 0) {
          setNitFel(respuesta2.Nit);
        } else {
          setNitFel("CF");
        }
      } catch (err) {
        console.error("Error al consultar el NIT:", err);
      }
    }
  };
  const handlePressConsultaSat = () => {
    setModalLoadingInfo(true);
    setStatus(transactionStatus.Loading);

    axios.get(`${baseUrlNitSat}/${nit}`).then((response) => {
      var respuesta = response.data;
      var respuesta2 = respuesta.Data;
      if (respuesta.Error == 0) {
        setSearchText("");
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
        setStatus(transactionStatus.Success);
        setInfoSat(respuesta2);
      }
      if (respuesta.Error == 1) {
        setModalLoadingInfo(false);
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    });
  };
  const validarDPI = (cui) => {
    if (!cui) {
      return false;
    }

    const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;

    if (!cuiRegExp.test(cui)) {
      return false;
    }

    cui = cui.replace(/\s/g, "");
    const depto = parseInt(cui.substring(9, 11), 10);
    const muni = parseInt(cui.substring(11, 13), 10);
    const numero = cui.substring(0, 8);
    const verificador = parseInt(cui.substring(8, 9), 10);

    const munisPorDepto = [
      17, 8, 16, 16, 13, 14, 19, 8, 24, 21, 9, 30, 32, 21, 8, 17, 14, 5, 11, 11,
      7, 17,
    ];

    if (depto === 0 || muni === 0) {
      //CUI con código de municipio o departamento inválido.
      return false;
    }

    if (depto > munisPorDepto.length) {
      //CUI con código de departamento inválido.
      return false;
    }

    if (muni > munisPorDepto[depto - 1]) {
      //CUI con código de municipio inválido.
      return false;
    }

    let total = 0;

    for (let i = 0; i < numero.length; i++) {
      total += parseInt(numero[i], 10) * (i + 2);
    }

    const modulo = total % 11;

    return modulo === verificador;
  };

  const handleChangeDpi = (value) => {
    const dpiClean = value.replace(/\s/g, ""); // Elimina todos los espacios en blanco
    setDpi(dpiClean);
    setDpiValid(validarDPI(dpiClean));
  };
  const validarNumeroPasaporte = (numero) => {
    // Validación genérica: al menos 6 caracteres y solo letras y números
    const regex = /^[A-Z0-9]{6,}$/i;

    if (regex.test(numero)) {
      setPassportState(true);
      return "Número de pasaporte válido";
    } else {
      setPassportState(false);
      return "Número de pasaporte inválido";
    }
  };
  const handleChangePassport = (value) => {
    setPassport(value);
    validarNumeroPasaporte(value);
  };
  const handlePrintInvoice = async (url) => {
    try {
      var pdfURL = url; //"https://api.tihsa.com/recibos-png/RCE-021061.png";
      setUrlPDF(url);

      if (pdfURL !== "") {
        const supported = await Linking.canOpenURL(pdfURL);

        if (supported) {
          await Linking.openURL(pdfURL);
          setModalInvoice(false);
        } else {
          console.log(`Don't know how to open this URL: ${pdfURL}`);
        }
        if (accountState !== 3) {
          setAccountState(accountState + 1);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePressCheckItem = useCallback(
    async (Codigo) => {
      try {
        const ArticleCode = Codigo;
        setIsLoading(true);
        const realItem = orderDetails.find((i) => i.Codigo == ArticleCode);
        if (!realItem) {
          notificar(
            "top",
            "Artículo no encontrado",
            "error",
            paddingTopNotification,
          );
          return;
        }

        const data = {
          CodEmp: codEmp,
          NumOrden: order,
          Codigo: ArticleCode,
          Picking: true,
          CantidadPicking: realItem.CantidadPicking,
        };
        const response = await axios.put(baseUrlUpdatePicking, data, {
          headers: { "content-type": "application/json" },
        });

        const respuesta = response.data;

        if (respuesta.Error === 0) {
          notificar(
            "top",
            respuesta.Mensaje,
            "success",
            paddingTopNotification,
          );

          // 🔹 MISMA LÓGICA ORIGINAL (sin refiltrar todo)
          setOrderDetails((prev) => {
            const index = prev.findIndex((i) => i.Codigo === ArticleCode);
            if (index === -1) return prev;

            const item = {
              ...prev[index],
              Picking: true,
            };

            // quitar de pendientes
            const newOrderDetails = [
              ...prev.slice(0, index),
              ...prev.slice(index + 1),
            ];

            // agregar a seleccionados
            setOrderDetailsChecked((checkedPrev) => [...checkedPrev, item]);

            return newOrderDetails;
          });
        } else {
          notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
        }
      } catch (error) {
        console.log("Error al actualizar picking:", error);
        notificar(
          "top",
          "Error al actualizar el picking",
          "error",
          paddingTopNotification,
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    },
    [orderDetails],
  );

  const handlePressUncheckItem = useCallback(async (item) => {
    try {
      setIsLoading(true);
      const ArticleCode = item.Codigo;
      const QuantityArticle = item.Cantidad;

      const data = {
        CodEmp: codEmp,
        NumOrden: order,
        Codigo: ArticleCode,
        Picking: false,
        CantidadPicking: QuantityArticle,
      };

      const response = await axios.put(baseUrlUpdatePicking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        // 🔹 MISMA LÓGICA ORIGINAL (invertida)
        setOrderDetailsChecked((prev) => {
          const index = prev.findIndex((i) => i.Codigo === ArticleCode);
          if (index === -1) return prev;

          const item = {
            ...prev[index],
            Picking: false,
          };

          // quitar de seleccionados
          const newChecked = [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
          ];

          // agregar a pendientes y ORDENAR
          setOrderDetails((detailsPrev) => {
            const updated = [...detailsPrev, item];

            updated.sort((a, b) =>
              (a.Ubicacion ?? "").localeCompare(b.Ubicacion ?? "", "es", {
                numeric: true,
                sensitivity: "base",
              }),
            );

            return updated;
          });

          return newChecked;
        });
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      console.log("Error al desmarcar picking:", error);
      notificar(
        "top",
        "Error al actualizar el picking",
        "error",
        paddingTopNotification,
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, []);

  const handleUpdateQuantity = (Codigo, newQuantity) => {
    if (newQuantity < 1) {
      // No permitir valores menores a 1
      return;
    }

    setOrderDetails((prev) =>
      prev.map((i) =>
        i.Codigo === Codigo
          ? {
              ...i,
              CantidadPicking: Number(newQuantity),
            }
          : i,
      ),
    );
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
        <View style={{ flexDirection: "row", flex: 1, paddingTop: 5 }}>
          <View
            style={{
              flex: 1,
              paddingVertical: 8,
              backgroundColor: "#DBEAFE",
              borderTopLeftRadius: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={"circle-user"} // Cambia el icono aquí
                color="#001d35"
                size={16}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#001d35",
                }}
              >
                Datos personales
              </Text>
            </Block>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 4,
                paddingHorizontal: 0,
                paddingBottom: 70,
                justifyContent: "start",
                backgroundColor: "#DBEAFE",
                borderRadius: 15,
              }}
              enableOnAndroid
              extraHeight={100}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled"
              behavior="position"
            >
              <Block
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 16,
                }}
              >
                <Block style={{ flex: 1, marginRight: 2 }}>
                  <Text style={styles.label}>Número de orden:</Text>
                  <Input
                    right
                    placeholder="Número de orden"
                    value={numOrden.toString()}
                    editable={false}
                    iconContent={<></>}
                  />
                </Block>
                <Block style={{ flex: 1 }}>
                  <Text style={styles.label}>Nit:</Text>
                  <Input
                    right
                    placeholder="Número de identificación tributaria"
                    value={nit}
                    editable={false}
                    iconContent={
                      nitState ? (
                        <View style={{ marginRight: -10 }}>
                          <FontAwesomeIcon
                            icon={"circle-check"}
                            size={20}
                            color="#2DCE89"
                          />
                        </View>
                      ) : (
                        <></>
                      )
                    }
                    success={nitState}
                    error={dpi.length !== 0 ? !nitState : false}
                  />
                </Block>
              </Block>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 16,
                }}
              >
                <Block style={{ flex: 1 }}>
                  <Text style={styles.label}>Dpi:</Text>
                  <Input
                    right
                    placeholder="Número de Dpi"
                    value={dpi}
                    onChangeText={handleChangeDpi}
                    iconContent={
                      <View style={{ marginRight: -10 }}>
                        {dpiValid && (
                          <FontAwesomeIcon
                            icon={"circle-check"}
                            size={20}
                            color="#2DCE89"
                          />
                        )}
                      </View>
                    }
                    keyboardType="numeric"
                    returnKeyType="done"
                    success={dpiState}
                    error={dpi > 0 ? !dpiState : false}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {!nitState && !dpiState && !passportState && (
                        <Text style={styles.required}>* Obligatorio</Text>
                      )}
                    </View>
                  </View>
                </Block>
                <Block style={{ flex: 1, marginRight: 2 }}>
                  <Text style={styles.label}>Código:</Text>
                  <Input
                    right
                    placeholder="Código de cliente"
                    value={codigoCliente.toString()}
                    onChangeText={setCodigoCliente}
                    iconContent={<></>}
                    keyboardType="numeric"
                    returnKeyType="done"
                    editable={false}
                  />
                </Block>
              </View>
              <Block style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <InputAutoGrowing
                  iconContent={<Block />}
                  returnKeyType="done"
                  placeholder="Observaciones"
                  value={nombre}
                  onChangeText={setNombre}
                  ref={observacionesRef}
                  editable={false}
                />
                {nombre == "" && (
                  <Text style={styles.required}>* Obligatorio</Text>
                )}
              </Block>
              <Block style={styles.inputContainer}>
                <Text style={styles.label}>Dirección:</Text>
                <InputAutoGrowing
                  returnKeyType="done"
                  placeholder="Ejemplo calle - guión, zona, colonia"
                  value={direccion}
                  iconContent={<Block />}
                  onChangeText={setDireccion}
                />
                {direccion == "" && (
                  <Text style={styles.required}>* Obligatorio</Text>
                )}
              </Block>
              <Block style={styles.inputContainer}>
                <Text style={styles.label}>Observaciones:</Text>
                <InputAutoGrowing
                  iconContent={<Block />}
                  returnKeyType="done"
                  placeholder="Observaciones"
                  value={observaciones}
                  onChangeText={setObservaciones}
                  ref={observacionesRef}
                />
              </Block>
              <Block
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 16,
                  //paddingTop: isMovil ? 2 : 8,
                }}
              >
                <Block
                  style={{
                    flex: 1,
                    marginRight: 2,
                  }}
                >
                  <Text style={styles.selectLabel}>Vendedor:</Text>
                  <Select2
                    options={optionsVendedor}
                    value={vendedor}
                    setValue={setVendedor}
                    onSelect={handleSelectVendedor}
                    placeholder="- Vendedores -"
                    doneText="Aceptar"
                  />
                </Block>
                <Block
                  style={{
                    flex: 1,
                  }}
                >
                  <Text style={styles.selectLabel}>Forma de pago:</Text>
                  <Select2
                    options={optionsFormasPago}
                    value={formaPago}
                    setValue={setFormaPago}
                    onSelect={handleSelectFormaPago}
                    placeholder="- FormaPago -"
                    doneText="Aceptar"
                  />
                </Block>
              </Block>
              <View
                style={{
                  padding: 4,
                  paddingHorizontal: 16,
                  borderRadius: 15,
                  marginTop: 4,
                  //backgroundColor: "#FFEDD5",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#001d35",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Nit para SAT:
                  <Text
                    style={{
                      marginLeft: 2,
                      color: "#001d35",
                      fontWeight: "bold",
                      fontSize: 14,
                      textDecorationLine: "underline",
                    }}
                  >
                    {nitFel}
                  </Text>
                </Text>
              </View>
            </KeyboardAwareScrollView>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Block
              style={{
                width: "100%",
                paddingVertical: 8,
                backgroundColor: "#DBEAFE",
                borderTopRightRadius: 10,
              }}
            >
              <Block
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={"cart-shopping"} // Cambia el icono aquí
                  color="#001d35"
                  size={16}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#001d35",
                  }}
                >
                  Detalle del pedido
                </Text>
              </Block>
            </Block>
            <Block
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: "#DBEAFE",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                overflow: "hidden",
                paddingRight: 8,
              }}
            >
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LottieView
                    autoPlay
                    source={ReceiveOrder}
                    style={{
                      width: 180,
                      height: 180,
                    }}
                  />
                </View>
              ) : (
                <OrderCart
                  orderDetails={orderDetails}
                  extraData={orderDetails}
                  onToggle={(item) => handlePressCheckItem(item.Codigo)}
                  showPacking={false}
                  showPicking={false}
                  renderEdit={(item) => (
                    <View
                      style={{
                        flex: 1,
                        maxWidth: 80,
                        justifyContent: "center",
                      }}
                    >
                      <InputSpinner
                        min={1}
                        max={item.Cantidad}
                        value={item.CantidadPicking}
                        onChange={(num) =>
                          handleUpdateQuantity(item.Codigo, num)
                        }
                        skin="default"
                        shadow={false}
                        showBorder={false}
                        rounded={false}
                        height={25}
                        style={{
                          backgroundColor: "white",
                          height: 25,
                          width: 80,
                        }}
                        buttonStyle={{
                          height: 25,
                          width: 25,
                          fontSize: 10,
                          backgroundColor: "#007AFF",
                        }}
                        inputStyle={{ height: 45, fontSize: 12 }}
                        iconSize={8}
                        returnKeyType="done"
                      />
                    </View>
                  )}
                />
              )}
            </Block>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#BFDBFE",
              borderRadius: 10,
              marginLeft: 4,
            }}
          >
            <Block
              style={{
                width: "100%",
                paddingVertical: 8,
              }}
            >
              <Block
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={"cart-arrow-down"} // Cambia el icono aquí
                  color="#001d35"
                  size={16}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#001d35",
                  }}
                >
                  Picking
                </Text>
              </Block>
            </Block>
            <Block
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: "#BFDBFE",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                overflow: "hidden",
                paddingRight: 8,
              }}
            >
              <View style={{ flex: 1, minHeight: 100 }}>
                <OrderCart
                  orderDetails={orderDetailsChecked}
                  onToggle={handlePressUncheckItem}
                  showPicking={true}
                />
              </View>
            </Block>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 5, // Adjust this value to control the distance from the bottom
          left: 16, // Adjust this value to control the distance from the right
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            padding: 16,
            backgroundColor: "#25D366",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => cargarInformacion()}
        >
          <FontAwesomeIcon icon={"retweet"} size={14} color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              marginLeft: 5,
            }}
          >
            recargar
          </Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "black",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingLeft: 8,
    paddingRight: 16,
    borderWidth: 0.5,
    borderRadius: 25,
    borderColor: argonTheme.COLORS.BORDER,
    backgroundColor: "white",
  },
  scannerContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingLeft: 8,
    paddingRight: 16,
    borderWidth: 0.5,
    borderRadius: 25,
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
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 3,
    marginHorizontal: 3,
  },
  productContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: isMovil ? 90 : 70,
    height: isMovil ? 90 : 70,
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
    width: isMovil ? 90 : 70,
    height: isMovil ? 90 : 70,
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
    height: 45,
    width: 45,
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
    width: "98%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
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
    marginBottom: 0,
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
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
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
    marginVertical: 20,
    width: isMovil ? "100%" : "50%",
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderRadius: 10,
    borderWidth: 2,
    //borderColor: "#00000030",
    borderColor: "#FED30B",
    textAlign: "center",
    color: "#007AFF",
  },
  focusCell: {
    //borderColor: "#000",
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
  checkBox: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 6,
  },
});
export default CheckinOrder;
