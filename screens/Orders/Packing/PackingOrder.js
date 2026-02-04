import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../../components/Header.js";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
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
import {
  consultarDpiSat,
  consultarNitSAT,
  OrdersDetail,
  PickingOrders,
  UpdatePacking,
  OrderPacks,
  OrderStatusPacking,
} from "../../../settings/EndPoints.js";
import { Images } from "../../../constants/index.js";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { searchEngineAdvance } from "../../Features/Helpers/SearchEngine.js";
import RenderViewArticle from "../../Articles/ViewArticle.js";
import RenderEditArticle from "../../Articles/EditArticle.js";
import CardArticleFerretExpo from "../../../components/CardArticleFerretExpo.js";
import InputSpinner from "react-native-input-spinner";
import {
  addArticle,
  updateArticle,
  clearOrder,
} from "../../Features/Order/OrderSlice.js";
import InputAutoGrowing from "../../../components/InputAutoGrowing.js";
import {
  useGetCustomersQuery,
  useGetVendedoresQuery,
  useGetFormasPagoQuery,
} from "../../../services/Api.js";
import { BlurView } from "expo-blur";
import Modals from "../../../components/Modals.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCart from "../../../components/OrderCart.js";

//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;
const BACKGROUND_KEY = "app_background";

const PackingOrder = () => {
  const route = useRoute();
  const { order } = route.params;
  const userState = useSelector((state) => state.user);
  const customerState = useSelector((state) => state.order.customer);
  const orderDetailsState = useSelector((state) => state.order.orderDetails);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const codVendedor = userState.length !== 0 ? userState[0].CodVendedor : 29;
  const codigoBodega = userState.length !== 0 ? userState[0].CodBodega : 13;
  const usuario = userState.length !== 0 ? userState[0].Usuario : "";
  const baseUrlUpdatePacking = UpdatePacking.EndPoint;
  const baseUrlOrderPacks = OrderPacks.EndPoint;
  const baseUrlOrderStatus = OrderStatusPacking.EndPoint;

  const baseUrlNitSat = consultarNitSAT.EndPoint;
  const baseUrlDpiSat = consultarDpiSat.EndPoint;
  const baseUrlSelectOrder = PickingOrders.EndPoint;
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
  const [modal, setModal] = useState(false);
  //Variables para confiración de código
  const [scannedText, setScannedText] = useState("");
  const [searchText, setSearchText] = useState("");

  const [dataArticles, setDataArticles] = useState([]);
  const [vendedor, setVendedor] = useState(codVendedor);
  const [optionsVendedor, setOptionsVendedor] = useState([]);
  const [formaPago, setFormaPago] = useState(1);
  const [formaPagoLabel, setFormaPagoLabel] = useState("CONTADO");
  const [optionsFormasPago, setOptionsFormasPago] = useState([]);
  const numColumns = isMovil ? 2 : 5;
  //Variables para el artículo
  const [article, setArticle] = useState({});
  const [cantidad, setCantidad] = useState(1);
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [nombreArticulo, setNombreArticulo] = useState("");
  const [precioArticulo, setPrecioArticulo] = useState("");
  const [costoArticulo, setCostoArticulo] = useState("");
  const [fotoArticulo, setFotoArticulo] = useState("");
  const [existenciaArticulo, setExistenciaArticulo] = useState(0);
  const [masterPack, setMasterPack] = useState(0);
  const [datosCalculados, setDatosCalculados] = useState([]); // Array para almacenar los datos calculados
  const [editar, setEditar] = useState(false);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [descuentoGeneralMax, setDescuentoGeneralMax] = useState(10);
  const [numOrden, setNumOrden] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(0);
  const [message, setMessage] = useState(
    ""
    //`Ha ocurrido un error al crear la factura, puede refacturar o anular el pago`
    //"Error de conexión con el servidor de Megaprint, estamos teniendo problemas técnicos. Intente nuevamente más tarde."
  );
  const [tipoCliente, setTipoCliente] = useState(1);
  const [modalStock, setModalStock] = useState(false);
  const [modalUpdateItem, setModalUpdateItem] = useState(false);
  const [inactivo, setInactivo] = useState(false);
  const [descontinuado, setDescontinuado] = useState(false);
  const [dpi, setDpi] = useState(0);
  const [dpiValid, setDpiValid] = useState(false);
  const [dpiState, setDpiState] = useState(false);
  const [modalDpi, setModalDpi] = useState(false);
  const [nombreTemp, setNombreTemp] = useState("");
  const [modalPhone, setModalPhone] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [telefonoState, setTelefonoState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoOrder, setInfoOrder] = useState([]);
  const [showCart, setShowCart] = useState(isMovil ? false : true);
  const scanBarRef = useRef(null);
  const observacionesRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle
  );
  const [baseUrlIpCompras, setBaseUrlIpCompras] = useState("");
  const [nitFel, setNitFel] = useState("");
  const [modalDetailPayment, setModalDetailPayment] = useState(false);
  const [payment, setPayment] = useState({});
  const [loadingNit, setLoadingNit] = useState(true);
  const [paquetes, setPaquetes] = useState([]);
  const [pack, setPack] = useState({
    TotalPaquetes: 1,
    PesoTotal: 0,
    NumOrden: 0,
    IdPaquete: 0,
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const [cantidadPl, setCantidadPl] = useState(1);
  const [packingChecked, setPackingChecked] = useState(false);

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
    if (infoOrder && infoOrder.length !== 0) {
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
      setOrderDetails(data.Detalles);
      setPaquetes(data.DetallePaquetes);
    }
  }, [infoOrder]);

  useEffect(() => {
    if (orderDetails.length === 0) {
      setPackingChecked(false);
      return;
    }

    const completed = orderDetails.every(
      (item) => Number(item.Cantidad) === Number(item.CantidadPl)
    );

    setPackingChecked(completed);
  }, [orderDetails]);

  useEffect(() => {
    handleClear();
  }, [accountState]);
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
      .get(`${baseUrlSelectOrder}/${codEmp}/${order}/${codigoBodega}`)
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
        title={"PACKING DE PEDIDO"}
        blur
      />
    );
  };
  //Función para mostrar la barra de búsqueda de cada página, se muestra cuando se agrega search en las props dónde se importa el Header
  const renderScanner = () => {
    return (
      <View
        style={{
          height: 58,
          paddingHorizontal: 5,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View style={styles.searchContainer}>
          <TextInput
            right
            color="black"
            style={{
              flex: 1,
              padding: 10,
              fontSize: 16,
              color: "black",
            }}
            value={scannedText}
            placeholder={"Escanear artículos"}
            placeholderTextColor="#8898AA"
            onChange={setScannedText}
            onSubmitEditing={scanArticleByCode}
            ref={scanBarRef}
            autoFocus
          />

          {scannedText ? (
            <TouchableOpacity
              onPress={setScannedText("")}
              style={scannedText && styles.circleCloseButton}
            >
              <Ionicons name={"close"} size={16} color={"#666666"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={scannedText && styles.circleCloseButton}
            >
              <FontAwesomeIcon
                size={16}
                color={theme.COLORS.MUTED}
                icon={"barcode"}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            width: 90,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 5,
            marginLeft: 5,
          }}
        >
          <InputSpinner
            min={0}
            value={cantidadPl}
            onChange={(num) => setCantidadPl(num)}
            onBlur={() => {
              if (!cantidadPl || cantidadPl === 0) {
                setCantidadPl(1);
              }
            }}
            skin="default"
            shadow={false}
            showBorder={false}
            rounded={false}
            height={45}
            buttonStyle={{
              width: 30,
              height: 45,
              borderRadius: 5,
              padding: 0,
              margin: 0,
              backgroundColor: "#007AFF",
            }}
            buttonTextStyle={{
              fontSize: 18,
              fontWeight: "600",
            }}
            inputStyle={{
              height: 45,
              fontSize: 12,
              textAlign: "center",
            }}
            iconSize={8}
            returnKeyType="done"
          />
        </View>
      </View>
    );
  };
  const scanArticleByCode = async (event) => {
    const scannedValue = event.nativeEvent.text?.toUpperCase();
    if (!scannedValue) {
       InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
      return;
    }

    try {
      const index = orderDetails.findIndex((item) => {
        const codigo = String(item.Codigo).trim().toUpperCase();
        const codigo2 = String(item.Codigo2).trim().toUpperCase();
        return codigo === scannedValue || codigo2 === scannedValue;
      });

      if (index === -1) {
        notificar(
          "top",
          "No se ha encontrado el código escaneado",
          "error",
          paddingTopNotification
        );
         InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }

      const article = orderDetails[index]; // ✅ AQUÍ
      if (article.CantidadPl + cantidadPl > article.Cantidad) {
        notificar(
          "top",
          `La cantidad de packing excede la cantidad de la orden para el código ${article.Codigo}`,
          "error",
          paddingTopNotification
        );
        InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }
      if (cantidadPl == 0) {
        notificar(
          "top",
          "La cantidad de packing no puede ser cero",
          "error",
          paddingTopNotification
        );
        InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }

      setIsLoading(true);

      const data = {
        CodEmp: codEmp,
        NumOrden: numOrden,
        Codigo: article.Codigo,
        CantidadPl: cantidadPl,
      };
      const response = await axios.put(baseUrlUpdatePacking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        const articleModified = respuesta.Data;
        // 🔹 Actualizar solo el artículo escaneado
        setOrderDetails((prev) =>
          prev.map((detail) =>
            detail.Codigo === articleModified.Codigo
              ? { ...detail, CantidadPl: articleModified.CantidadPl }
              : detail
          )
        );

        // 🔹 Opcional: reset cantidad
        setCantidadPl(1);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }

      InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
      setIsLoading(false);
    } catch (error) {
      notificar(
        "top",
        "Error al procesar el escaneo",
        "error",
        paddingTopNotification
      );
      InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
    }
  };
  const searchArticleByCode = async () => {
    const scannedValue = searchText?.trim().toUpperCase();
    setSearchText("");
    if (!scannedValue) {
      setModal(false);
      InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
      return;
    }

    try {
      const index = orderDetails.findIndex((item) => {
        const codigo = String(item.Codigo).trim().toUpperCase();
        const codigo2 = String(item.Codigo2).trim().toUpperCase();
        return codigo === scannedValue || codigo2 === scannedValue;
      });

      if (index === -1) {
        notificar(
          "top",
          "No se ha encontrado el código escaneado",
          "error",
          paddingTopNotification
        );
        setModal(false);
        InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }

      const article = orderDetails[index]; // ✅ AQUÍ
      if (article.CantidadPl + cantidadPl > article.Cantidad) {
        notificar(
          "top",
          `La cantidad de packing excede la cantidad de la orden para el código ${article.Codigo}`,
          "error",
          paddingTopNotification
        );
        setModal(false);
        InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }
      if (cantidadPl == 0) {
        notificar(
          "top",
          "La cantidad de packing no puede ser cero",
          "error",
          paddingTopNotification
        );
        setModal(false);
        InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
        return;
      }
      //Se cierra el modal mientras se actualiza el packing
      setModal(false);
      setIsLoading(true);

      const data = {
        CodEmp: codEmp,
        NumOrden: numOrden,
        Codigo: article.Codigo,
        CantidadPl: cantidadPl,
      };
      const response = await axios.put(baseUrlUpdatePacking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        const articleModified = respuesta.Data;
        // 🔹 Actualizar solo el artículo escaneado
        setOrderDetails((prev) =>
          prev.map((detail) =>
            detail.Codigo === articleModified.Codigo
              ? { ...detail, CantidadPl: articleModified.CantidadPl }
              : detail
          )
        );

        // 🔹 Opcional: reset cantidad
        setCantidadPl(1);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }

     InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
      setIsLoading(false);
    } catch (error) {
      notificar(
        "top",
        "Error al procesar el escaneo",
        "error",
        paddingTopNotification
      );
      InteractionManager.runAfterInteractions(() => {
          scanBarRef.current?.focus();
        });
    }
  };

  const handleClear = () => {
    if (scanBarRef.current) {
      scanBarRef.current.focus();
    }
  };
  const handlePressBack = () => {
    dispatch(clearOrder());
    navigation.goBack();
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
    setLoadingNit(false);
  };

  const buscarCodigo = (sustituto) => {
    let data = [];

    const codigoSustituto = dataArticles.find(
      (articulo) => articulo.Codigo == sustituto
    );
    if (codigoSustituto) {
      setEditar(false);
      setArticle(codigoSustituto);
      setModal(true);
      setCodigoArticulo(codigoSustituto.Codigo);
      setNombreArticulo(codigoSustituto.NombreArticulo);
      setPrecioArticulo(
        tipoCliente == 1 ? codigoSustituto.Precio : codigoSustituto.Precio
      );
      setCostoArticulo(codigoSustituto.Costo);
      setFotoArticulo(codigoSustituto.Foto);
      setExistenciaArticulo(codigoSustituto.Existencia);
      setMasterPack(codigoSustituto.MasterPack);
      setInactivo(codigoSustituto.Inactivo);
      setDescontinuado(codigoSustituto.Descontinuado);
    }
  };
  const handleAgregarDatos = (datos) => {
    setDatosCalculados(datos);
  };
  // Manejar el evento para agregar un artículo al carrito
  const handleAddToCart = () => {
    const codigoArticuloExiste = orderDetailsState.some(
      (item) => item.Codigo === codigoArticulo
    );

    if (codigoArticuloExiste) {
      //Busca y modifica el artículo si ya existe en el carrito
      const modifiedDetail = orderDetailsState
        .map((detail) => {
          if (detail.Codigo === codigoArticulo) {
            const suma = Math.round(Number(detail.Cantidad) + Number(cantidad));
            if (suma > detail.Existencia) {
              setModal(false);
              notificar(
                "top",
                `La cantidad seleccionada sobrepasa la existencia del artículo`,
                "error",
                paddingTopNotification
              );
              return null; // Devuelve null para indicar que no se ha modificado este elemento
            } else {
              const precioTotal =
                Math.round(
                  (Number(suma) * Number(detail.Pv) + Number.EPSILON) * 100
                ) / 100;
              const subtotalArticulo =
                Math.round(
                  (Number(precioTotal) / Number(1.12) + Number.EPSILON) * 100
                ) / 100;
              const ivaArticulo =
                Math.round(
                  (Number(precioTotal) -
                    Number(subtotalArticulo) +
                    Number.EPSILON) *
                    100
                ) / 100;
              const descuentoArticulo =
                Math.round(
                  ((Number(detail.Precio) - Number(detail.Pv)) * Number(suma) +
                    Number.EPSILON) *
                    100
                ) / 100;
              // Devuelve solo el objeto modificado en cantidad
              return {
                ...detail,
                Descuento: Number(descuentoArticulo.toFixed(2)),
                Cantidad: Number(suma),
                Total: Number(precioTotal.toFixed(2)),
                SubTotal: Number(subtotalArticulo.toFixed(2)),
                Iva: Number(ivaArticulo.toFixed(2)),
              };
            }
          }
          // Devuelve null para indicar que no se ha modificado este elemento
          return null;
        })
        .filter(Boolean);
      //Si el artículo cumple con la cantidad menor o igual a la existencia realiza la actualización con el Api
      if (modifiedDetail.length !== 0) {
        const articleModified = modifiedDetail[0];
        dispatch(updateArticle(articleModified));
        setModal(false);
      }
      setModal(false);
    } else {
      //Agrega el artículo al carrito del cliente

      var newRow = {
        CodEmp: codEmp,
        Secuencia: obtenerProximaSecuencia(orderDetailsState),
        Codigo: codigoArticulo,
        NombreArticulo: nombreArticulo,
        Cantidad: Number(cantidad),
        Existencia: Number(existenciaArticulo),
        Precio: Number(precioArticulo.toFixed(2)),
        Pv: Number(datosCalculados.PrecioVenta.toFixed(2)),
        Total: Number(datosCalculados.Total.toFixed(2)),
        CodTdesc: 0,
        Descuento: Number(datosCalculados.Descuento.toFixed(2)),
        Pdescuento: Number(datosCalculados.Pdescuento.toFixed(2)),
        CodBodega: codigoBodega,
        Costo: Number(costoArticulo.toFixed(2)),
        Foto: fotoArticulo,
        Iva: Number(datosCalculados.Iva.toFixed(2)),
        SubTotal: Number(datosCalculados.Subtotal.toFixed(2)),
        Servicio: false,
        Traslado: false,
        CodigoPromo: "",
        MasterPack: masterPack,
        CodTarticulo: article.CodTarticulo,
      };
      dispatch(addArticle(newRow));
      setModal(false);
    }
    setCantidad(1);
    setFotoArticulo("");
    setEditar(false);
    handleClear();
  };
  const handleEditOrderDetail = () => {
    const codigoArticuloExiste = orderDetailsState.some(
      (item) => item.Codigo == codigoArticulo
    );
    if (codigoArticuloExiste) {
      //Busca y modifica el artículo si ya existe en el carrito
      const modifiedDetail = orderDetailsState
        .map((detail) => {
          if (detail.Codigo === codigoArticulo) {
            // Devuelve solo el objeto modificado en cantidad
            return {
              ...detail,
              NombreArticulo: nombreArticulo || detail.NombreArticulo,
              Cantidad: Number(cantidad),
              Pv: Number(datosCalculados.PrecioVenta.toFixed(2)),
              Total: Number(datosCalculados.Total.toFixed(2)),
              Descuento: Number(datosCalculados.Descuento.toFixed(2)),
              Pdescuento: Number(datosCalculados.Pdescuento),
              Iva: Number(datosCalculados.Iva.toFixed(2)),
              SubTotal: Number(datosCalculados.Subtotal.toFixed(2)),
            };
          }
          // Devuelve null para indicar que no se ha modificado este elemento
          return null;
        })
        .filter(Boolean);
      //Si el artículo cumple con la cantidad menor o igual a la existencia realiza la actualización con el Api
      const articleModified = modifiedDetail[0];
      dispatch(updateArticle(articleModified));
    }
    setModal(false);
    setCantidad(1);
    setFotoArticulo("");
    setEditar(false);
    if (scanBarRef.current) {
      scanBarRef.current.focus();
    }
  };
  function formatCurrency(amount, currencyCode) {
    var moneda = amount;
    if (typeof moneda !== "number") {
      // Eliminar las comas y convertir el string en un número
      moneda = parseFloat(amount.replace(/,/g, ""));
    }
    return moneda.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }
  const obtenerProximaSecuencia = (data) => {
    if (typeof data === "undefined" || data.length === 0) {
      return 1;
    }

    var maxSecuencia = data.reduce((prev, current) => {
      return prev.Secuencia > current.Secuencia ? prev : current;
    });

    return maxSecuencia.Secuencia + 1;
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
  const handleSearchDpiSat = () => {
    if (dpiValid) {
      setModalDpi(true);
      setStatus(transactionStatus.Loading);
      axios.get(`${baseUrlDpiSat}/${dpi}`).then((response) => {
        var respuesta = response.data;
        var respuesta2 = respuesta.Data;

        if (respuesta.Error == 0) {
          setStatus(transactionStatus.Success);
          setDpiState(true);
          setNombreTemp(respuesta2.Nombre);
        }
        if (respuesta.Error == 1) {
          notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
          setDpiState(false);
          setModalDpi(false);
        }
      });
    } else {
      setDpiState(false);
    }
  };
  const testConnection = async () => {
    try {
      const response = await axios.head(`${baseUrlIpCompras}`, {
        timeout: 500,
      });
      if (response.status === 200) {
        notificar("top", "Conexión exitosa", "success", paddingTopNotification);
      } else {
        notificar(
          "top",
          "No se ha podido establecer conexión con el POS",
          "error",
          paddingTopNotification
        );
      }
    } catch (error) {
      notificar(
        "top",
        `Error de conexión, revise la conexión a internet del POS. ${error.message}`,
        "error",
        paddingTopNotification
      );
      return {
        status: false,
        message: `Error de conexión, revise la conexión a internet del POS. ${error.message}`,
      };
    }
  };
  const handleChangeDpi = (value) => {
    const dpiClean = value.replace(/\s/g, ""); // Elimina todos los espacios en blanco
    setDpi(dpiClean);
    setDpiValid(validarDPI(dpiClean));
  };
  const validarNumeroTelefono = (numero) => {
    const numeroLimpio = numero.replace(/\D/g, "");

    if (numeroLimpio.length === 8) {
      const numeroFormateado = `${numeroLimpio.slice(
        0,
        4
      )}-${numeroLimpio.slice(4)}`;
      return numeroFormateado;
    }

    return null;
  };
  const handleChangePhone = (value) => {
    const numeroValidado = validarNumeroTelefono(value);
    if (numeroValidado) {
      setTelefono(numeroValidado);
      setTelefonoState(true);
    } else {
      if (value.length < 9) {
        setTelefono(value);
        setTelefonoState(false);
      }
    }
  };
  const renderItemPacks = ({ item }) => {
    const handleSelectPack = () => {
      setEditar(true);
      setPack({
        TotalPaquetes: item.TotalPaquetes,
        PesoTotal: item.PesoTotal,
        NumOrden: item.NumOrden,
        IdPaquete: item.IdPaquete,
      });
    };

    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#EFEFEF"
        onPress={handleSelectPack}
      >
        <View style={[styles.mainCardView, { backgroundColor: "white" }]}>
          <View style={{ flexDirection: "row", padding: 6 }}>
            {/* Ícono */}
            <View
              style={{
                width: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={"box"} size={28} color="#007AFF" />
            </View>

            {/* Información */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: 4,
                }}
              >
                Paquetes: {item.TotalPaquetes}
              </Text>

              <Text style={{ fontSize: 11, color: "black" }}>
                Peso: {item.PesoTotal} lb
              </Text>

              <View
                style={{
                  marginTop: 3,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 11, color: "gray" }}>
                  IdPaquete: {item.IdPaquete}
                </Text>
                <Text style={{ fontSize: 11, color: "black" }}>
                  Orden #{item.NumOrden}
                </Text>
              </View>

              {/* Botones */}
            </View>
            <View
              style={{
                flex: 1,
                maxWidth: 80,
                marginTop: 8,
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => handleDeletePack(item)}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#FF3B30",
                }}
              >
                <Text
                  style={{ color: "#FF3B30", fontSize: 11, marginRight: 2 }}
                >
                  Eliminar
                </Text>
                <FontAwesomeIcon icon={"trash-can"} size={14} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  const handleDeletePack = async (item) => {
    if (!item?.IdPaquete) {
      notificar("top", "Paquete inválido", "error", paddingTopNotification);
      return;
    }

    try {
      const response = await axios.delete(
        `${baseUrlOrderPacks}/${item.IdPaquete}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        // 🔹 Eliminar del estado
        const newRows = paquetes.filter(
          (packItem) => packItem.IdPaquete !== item.IdPaquete
        );
        setPaquetes(newRows);
        setEditar(false);
        setPack({
          TotalPaquetes: 1,
          PesoTotal: 0,
          NumOrden: 0,
          IdPaquete: 0,
        });

        notificar(
          "top",
          respuesta.Mensaje || "Paquete eliminado correctamente",
          "success",
          paddingTopNotification
        );
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
      notificar(
        "top",
        "Error al eliminar el paquete",
        "error",
        paddingTopNotification
      );
    }
  };

  const handleAddPack = async (event) => {
    event.preventDefault();

    try {
      const data = {
        CodEmp: codEmp,
        NumOrden: numOrden,
        SerieFactura: "",
        NumFactura: 0,
        NumeroGuia: "",
        TotalPaquetes: pack.TotalPaquetes,
        PesoTotal: pack.PesoTotal,
        FechaRegistro: new Date().toISOString(),
        UsuarioRegistro: usuario,
      };

      const response = await axios.post(
        `${baseUrlOrderPacks}/${usuario}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      const respuesta = response.data;

      if (respuesta.Error === 0) {
        const nuevoPaquete = {
          IdPaquete: respuesta.Data.IdPaquete,
          NumOrden: numOrden,
          TotalPaquetes: pack.TotalPaquetes,
          PesoTotal: pack.PesoTotal,
        };

        setPaquetes((prev) => [...prev, nuevoPaquete]);

        // Reset del formulario
        setPack({
          TotalPaquetes: 1,
          PesoTotal: 0,
        });

        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      notificar(
        "top",
        "Error al crear el paquete",
        "error",
        paddingTopNotification
      );
    }
  };

  const handleEditPack = async (event) => {
    event?.preventDefault();

    try {
      const data = {
        CodEmp: codEmp,
        NumOrden: numOrden,
        SerieFactura: "",
        NumFactura: 0,
        NumeroGuia: "",
        TotalPaquetes: pack.TotalPaquetes,
        PesoTotal: pack.PesoTotal,
        FechaRegistro: new Date().toISOString(),
        UsuarioRegistro: usuario,
      };

      const response = await axios.put(
        `${baseUrlOrderPacks}/${usuario}/${pack.IdPaquete}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        setPaquetes((prev) =>
          prev.map((item) =>
            item.IdPaquete === pack.IdPaquete ? { ...item, ...pack } : item
          )
        );

        setPack({
          TotalPaquetes: 1,
          PesoTotal: 0,
        });

        setEditar(false);

        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      notificar(
        "top",
        "Error al actualizar el paquete",
        "error",
        paddingTopNotification
      );
    }
  };

  const handlePressCheckItem = useCallback((item) => {
    setOrderDetails((prev) => {
      const index = prev.findIndex((i) => i.Codigo === item.Codigo);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        Traslado: !updated[index].Traslado,
      };

      return updated;
    });
  }, []);
  const handlePressSendPacking = async (event) => {
    event?.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${baseUrlOrderStatus}/${numOrden}/${usuario}`,
        [],
        { headers: { "Content-Type": "application/json" } }
      );

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
      setIsLoading(false);
    } catch (error) {
      notificar(
        "top",
        "Error al actualizar el packing",
        "error",
        paddingTopNotification
      );
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
        {accountState == 0 ? (
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
                  <Block style={{ flex: 1, marginRight: 2 }}>
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
                      onBlur={handleSearchDpiSat}
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
                      onSubmitEditing={handleSearchDpiSat}
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
                        {!nitState && !dpiState && (
                          <Text style={styles.required}>* Obligatorio</Text>
                        )}

                        {dpiValid && (
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              marginTop: -6,
                              padding: 4,
                              backgroundColor: "#007AFF", //"#0F334F",
                              borderRadius: 5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={handleSearchDpiSat}
                          >
                            <FontAwesomeIcon
                              icon={"id-badge"}
                              size={10}
                              color="white"
                            />
                            <Text
                              style={{
                                color: "white",
                                fontSize: 10,
                                marginLeft: 2,
                              }}
                            >
                              Consulta SAT
                            </Text>
                          </TouchableOpacity>
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
                    Nit para SAT:{" "}
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
                {renderScanner()}
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
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <>
                    <OrderCart
                      orderDetails={orderDetails}
                      onToggle={handlePressCheckItem}
                      showPacking={true}
                      showPicking={true}
                    />
                  </>
                )}
              </Block>
            </View>
            <View
              style={{
                flex: 0.9,
                minHeight: 150,
                paddingBottom: 8,
                borderRadius: 10,
              }}
            >
              <Block
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#BFDBFE", //"#DBEAFE",
                  padding: 8,
                  marginHorizontal: 8,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    textAlign: "center",
                    color: "#001d35",
                    fontWeight: "bold",
                  }}
                >
                  Paquetes de Guatex
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    textAlign: "center",
                    color: "#001d35",
                    fontWeight: "bold",
                  }}
                >
                  {paquetes.length != 0
                    ? paquetes.reduce((total, p) => total + p.TotalPaquetes, 0)
                    : 0}
                </Text>
              </Block>

              <Block
                style={{
                  flex: 1,
                  borderRadius: 10,
                  minHeight: 80,
                  paddingVertical: 8,
                  marginHorizontal: 8,
                }}
              >
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <View
                    style={{
                      flex: 1,
                      marginRight: 2,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginBottom: 5 }}>
                      Número de paquetes:
                    </Text>
                    <InputSpinner
                      min={1}
                      value={pack.TotalPaquetes}
                      onChange={(num) =>
                        setPack({ ...pack, TotalPaquetes: num })
                      }
                      skin="default"
                      shadow={false}
                      showBorder={false}
                      rounded={false}
                      height={45}
                      style={{
                        backgroundColor: "white",
                        height: 45,
                      }}
                      buttonStyle={styles.buttonStyle}
                      inputStyle={{ height: 45, fontSize: 12 }}
                      iconSize={8}
                      returnKeyType="done"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 2 }}>
                    <Text style={styles.label}>Peso (Lb):</Text>
                    <Input
                      right
                      placeholder="Peso por paquete"
                      value={pack.PesoTotal}
                      onChangeText={(value) =>
                        setPack({ ...pack, PesoTotal: value })
                      }
                      iconContent={<></>}
                      keyboardType="numeric"
                      returnKeyType="done"
                      onSubmitEditing={handleAddPack}
                    />
                    {pack.PesoTotal == 0 && (
                      <Text style={styles.required}>* Obligatorio</Text>
                    )}
                  </View>
                </View>
                {!editar ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#007AFF",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 16,
                    }}
                    onPress={handleAddPack}
                  >
                    <FontAwesomeIcon icon={"cube"} size={16} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        marginLeft: 5,
                      }}
                    >
                      Agregar paquete
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#0F334F",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 16,
                    }}
                    onPress={() => {
                      handleEditPack();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={"floppy-disk"}
                      size={16}
                      color="white"
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        marginLeft: 5,
                      }}
                    >
                      Guardar paquete
                    </Text>
                  </TouchableOpacity>
                )}

                {paquetes.length != 0 && (
                  <FlashList
                    data={paquetes}
                    renderItem={renderItemPacks}
                    keyExtractor={(item, index) => index}
                    estimatedItemSize={80}
                  />
                )}
              </Block>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
      {accountState === 0 && (
        <>
          <Modals
            visible={modalStock}
            onClose={() => {
              setModalStock(false);
            }}
            width={isMovil ? "98%" : "45%"}
            height={isMovil ? "50%" : "50%"}
            hideFooter
            hideHeader
          >
            <View
              style={{
                flex: 1,
                borderRadius: 40,
                alignItems: "center", // Cambiado a "center" en lugar de "flex-start"
                justifyContent: "center",
                bottom: 0,
              }}
            >
              <ActivityIndicator size="large" color="#007AFF" />
              <Text
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  color: "#007AFF",
                }}
              >
                Consultando existencias
              </Text>
            </View>
          </Modals>
          <Modals
            visible={modalUpdateItem}
            onClose={() => {
              setModalUpdateItem(false);
            }}
            width={isMovil ? "98%" : "45%"}
            height={isMovil ? "50%" : "50%"}
            hideFooter
            hideHeader
          >
            <View
              style={{
                flex: 1,
                borderRadius: 40,
                alignItems: "center", // Cambiado a "center" en lugar de "flex-start"
                justifyContent: "center",
                bottom: 0,
              }}
            >
              <ActivityIndicator size="large" color="#007AFF" />
              <Text
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  color: "#007AFF",
                }}
              >
                Actualizando artículos
              </Text>
            </View>
          </Modals>
        </>
      )}

      <Modals
        visible={modal}
        onClose={() => setModal(false)}
        width={isMovil ? "98%" : "35%"}
        height="70%"
        hideHeader={false}
        hideFooter
        fullScreen
      >
        <View style={styles.modalCargando}>
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingHorizontal: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={"magnifying-glass"}
              size={100}
              color={"#007AFF"}
            />
            <Text
              style={{
                marginVertical: 10,
                fontSize: 14,
                color: "#007AFF",
                textAlign: "center",
              }}
            >
              Ingresa el código para hacer packing
            </Text>
          </View>
          <Block style={{ flex: 1, marginRight: 2 }}>
            <Text style={styles.label}>Código:</Text>
            <Input
              right
              placeholder="Código de artículo"
              value={searchText}
              onChangeText={(value) => setSearchText(value.toUpperCase())}
              onSubmitEditing={searchArticleByCode}
              iconContent={<></>}
            />
            <Block
              style={{
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 15,
                  backgroundColor: "#007AFF",
                  padding: 8,
                  paddingHorizontal: 32,
                  marginLeft: 5,
                }}
                onPress={() => {
                  searchArticleByCode();
                  setModalPhone(false);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  Buscar
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </View>
      </Modals>
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
      {packingChecked && (
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 5, // Adjust this value to control the distance from the bottom
            right: 16, // Adjust this value to control the distance from the right
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              padding: 16,
              backgroundColor: "#007AFF",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => (isLoading ? null : handlePressSendPacking())}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <FontAwesomeIcon icon={"floppy-disk"} size={14} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    marginLeft: 5,
                  }}
                >
                  Guardar Packing
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    borderRadius: 5,
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
export default PackingOrder;
