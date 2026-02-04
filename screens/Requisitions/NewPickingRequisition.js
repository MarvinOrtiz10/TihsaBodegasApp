import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Header from "../../components/Header.js";
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
  InteractionManager,
} from "react-native";
import argonTheme from "../../constants/Theme.js";
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Input } from "../../components/index.js";
import Select2 from "../../components/Select2.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ToastNotification from "../../components/ToastNotification.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import LottieView from "lottie-react-native";
import ReceiveOrder from "../../assets/animations/Receive-order.json";
import {
  Requisition,
  UpdateRequisitionPicking,
  Articles,
} from "../../settings/EndPoints.js";
import { Images } from "../../constants/index.js";
import InputAutoGrowing from "../../components/InputAutoGrowing.js";
import { useGetBodegasQuery, useGetArticlesQuery } from "../../services/Api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RequisitionCart from "../../components/RequisitionCart.js";
import RenderEditArticle from "../Articles/EditArticle.js";
import RenderViewArticle from "../Articles/ViewArticle.js";
import Modals from "../../components/Modals.js";
import CardArticle from "../../components/CardArticle.js";
import { TouchableWithoutFeedback } from "react-native-web";
import {
  preprocessDataOnce,
  searchEngineAdvance,
} from "../Features/Helpers/SearchEngine.js";
import { FlashList } from "@shopify/flash-list";
import { Alert } from "react-native";
import EmptyCart from "../../assets/animations/empty-cart.json";

//Variable para identificar el tamaño del dispositivo del cual se está accediendo al app
const isMovil = width < 650 ? true : false;
//Variable para identificar el sistema operativo del dispositivo del cual se está accediendo al app
const Iphone = Platform.OS === "ios" ? true : false;
const paddingTopNotification = Iphone ? 55 : 40;
const BACKGROUND_KEY = "app_background";

const NewPickingRequisition = () => {
  const route = useRoute();
  const { order } = route.params;
  const userState = useSelector((state) => state.user);
  const codEmp = userState.length !== 0 ? userState[0].CodEmp : 1;
  const codBodega = userState.length !== 0 ? userState[0].CodBodega : 1;
  const Usuario = userState.length !== 0 ? userState[0].Usuario : "Sin usuario";
  const baseUrl = Requisition.EndPoint;
  const baseUrlUpdatePicking = UpdateRequisitionPicking.EndPoint;
  const baseUrlArticles = Articles.EndPoint;
  const {
    data: dataBodegas,
    error: errorBodegas,
    isLoading: loadingBodegas,
  } = useGetBodegasQuery();
  const {
    data,
    error: errorArticles,
    isLoading: loadingArticles,
  } = useGetArticlesQuery({ CodigoBodega: codBodegaOrigen });

  const [accountState, setAccountState] = useState(0);
  const toastRef = useRef(null);
  const navigation = useNavigation();

  const [optionsBodegas, setOptionsBodegas] = useState([]);
  const [numTraslado, setNumTraslado] = useState(0);
  const [destino, setDestino] = useState("");
  const [codBodegaOrigen, setCodBodegaOrigen] = useState(0);
  const [codBodegaDestino, setCodBodegaDestino] = useState(0);
  const [fecha, setFecha] = useState(new Date());
  const [fechaReserva, setFechaReserva] = useState(null);
  const [usuarioReserva, setUsuarioReserva] = useState("");
  const [reservada, setReservada] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [usuarioCreacion, setUsuarioCreacion] = useState(Usuario);
  const [editar, setEditar] = useState(false);
  const [modal, setModal] = useState(false);
  /*Variables para agregar o editar artículos*/
  const [article, setArticle] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [nombreArticulo, setNombreArticulo] = useState("");
  const [costoArticulo, setCostoArticulo] = useState("");
  const [fotoArticulo, setFotoArticulo] = useState("");
  const [existenciaArticulo, setExistenciaArticulo] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [infoRequisition, setInfoRequisition] = useState([]);

  const observacionesRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    Images.BackgroundDetalle,
  );
  const [requisitionDetails, setRequisitionDetails] = useState([]);
  const [requisitionDetailsCopy, setRequisitionsDetailsCopy] = useState([]);
  const [requisitionDetailsChecked, setRequisitionDetailsChecked] = useState(
    [],
  );
  //Variables para confiración de código
  const [searchText, setSearchText] = useState("");
  const [dataArticles, setDataArticles] = useState([]);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);
  const searchBarRef = useRef(null);

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
  const parseFechaApi = (fechaStr) => {
    if (!fechaStr || typeof fechaStr !== "string") return null;

    const [fecha, hora = "00:00:00"] = fechaStr.split(" ");
    const [day, month, year] = fecha.split("/");
    const [hh = 0, mm = 0, ss = 0] = hora.split(":");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hh),
      Number(mm),
      Number(ss),
    );

    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    loadBackground();
  }, []);
  useEffect(() => {
    if (dataBodegas) {
      setOptionsBodegas(dataBodegas.Data);
    }
  }, [dataBodegas]);

  useEffect(() => {
    if (infoRequisition.length !== 0) {
      const data = infoRequisition[0];
      setNumTraslado(data.NumTraslado);
      setCodBodegaDestino(data.CodBodegaDestino.value);
      setCodBodegaOrigen(data.CodBodegaOrigen.value);
      //Carga los artículos de la bodega de origen
      cargarArticulos(data.CodBodegaOrigen.value);
      setDestino(data.Destino);
      setFecha(parseFechaApi(data.Fecha) ?? new Date());
      setFechaReserva(parseFechaApi(data.FechaReserva));
      setObservaciones(data.Observaciones);
      setReservada(data.Reservado);
      setUsuarioReserva(data.UsuarioReserva);
      setUsuarioCreacion(data.Usuario);
      // 🔹 FILTRO DE DETALLES POR PICKING
      const detalles = data.DetalleRequisicion ?? [];
      const detallesChecked = [];
      const detallesPendientes = [];

      for (const item of detalles) {
        if (item.Picking === true) {
          detallesChecked.push(item);
        } else {
          detallesPendientes.push(item);
        }
      }
      setRequisitionDetails(detallesPendientes);
      setRequisitionDetailsChecked(detallesChecked);
      setRequisitionsDetailsCopy(detalles);
    }
  }, [infoRequisition]);

  const requisitionCodes = useMemo(() => {
    return new Set(requisitionDetails.map((i) => i.Codigo));
  }, [requisitionDetails]);

  const cargarInformacion = () => {
    setIsLoading(true);
    axios.get(`${baseUrl}/${numTraslado}`).then((response) => {
      var respuesta = response.data;
      if (respuesta.Error == 0) {
        setInfoRequisition([respuesta.Data]);
      }
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  const cargarArticulos = (CodigoBodega) => {
    axios.get(`${baseUrlArticles}/${CodigoBodega}`).then((response) => {
      var respuesta = response.data;
      if (respuesta.Error == 0) {
        var respuestaData = preprocessDataOnce(respuesta.Data, [
          "Codigo",
          "Codigo2",
          "NombreArticulo",
        ]);
        setDataArticles(respuestaData);
      }
    });
  };
  const renderHeader = () => {
    return (
      <Header
        back
        onBackPress={handlePressBack}
        scrollTittle={false}
        title={"NUEVA REQUISICION"}
        blur
      />
    );
  };
  /* Función para mostrar la barra de búsqueda de cada página, se muestra cuando se agrega search en las props dónde se importa el Header */
  const renderSearch = () => {
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="Buscar artículos por código, nombre o keywords"
        placeholderTextColor="#8898AA"
        iconContent={
          <TouchableOpacity
            onPress={showClearIcon ? handleClear : null}
            style={showClearIcon && styles.circleCloseButton}
          >
            {showClearIcon ? (
              <FontAwesomeIcon icon={"xmark"} size={16} color={"#666666"} />
            ) : (
              <FontAwesomeIcon
                icon={"magnifying-glass"}
                color={theme.COLORS.MUTED}
                size={16}
              />
            )}
          </TouchableOpacity>
        }
        value={searchText}
        onChangeText={handleSearch}
        selectTextOnFocus={true}
        ref={searchBarRef}
      />
    );
  };
  const handleSearch = (text) => {
    setSearchText(text);
    setShowClearIcon(text.length > 0);

    if (text.length <= 2) {
      setSearchResults([]);
      return;
    }

    const dataFuse = searchEngineAdvance(
      dataArticles,
      text,
      "CodTarticulo",
      "asc",
    );

    const results = dataFuse.map((item) => ({
      ...item,
      AlreadyAdded: requisitionCodes.has(item.Codigo),
    }));

    setSearchResults(results);

    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleClear = () => {
    setSearchText("");
    setShowClearIcon(false);
    setSearchResults([]);
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
  const handleSelectBodegaOrigen = (value, label) => {
    if (value == null) {
      setCodBodegaOrigen(0);
    } else {
      setCodBodegaOrigen(value);
      //Carga los artículos de la bodega de origen
      cargarArticulos(value);
    }
  };
  const handleSelectBodegaDestino = (value) => {
    if (value == null) {
      setCodBodegaDestino(0);
    } else {
      setCodBodegaDestino(value);
    }
  };
  const handlePressCheckItem = useCallback(async (item) => {
    try {
      setIsLoading(true);
      const ArticleCode = item.Codigo;

      const data = {
        CodEmp: codEmp,
        numTraslado: order,
        Codigo: ArticleCode,
        Cantidad: item.Cantidad,
        Picking: true,
      };

      const response = await axios.put(baseUrlUpdatePicking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        // 🔹 MISMA LÓGICA ORIGINAL (sin refiltrar todo)
        setRequisitionDetails((prev) => {
          const index = prev.findIndex((i) => i.Codigo === ArticleCode);
          if (index === -1) return prev;

          const item = {
            ...prev[index],
            Picking: true,
          };

          // quitar de pendientes
          const newrequisitionDetails = [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
          ];

          // agregar a seleccionados
          setRequisitionDetailsChecked((checkedPrev) => [...checkedPrev, item]);

          return newrequisitionDetails;
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
      setIsLoading(false);
    }
  }, []);

  const handlePressUncheckItem = useCallback(async (item) => {
    const ArticleCode = item.Codigo;
    try {
      setIsLoading(true);

      const data = {
        CodEmp: codEmp,
        numTraslado: order,
        Codigo: ArticleCode,
        Cantidad: item.Cantidad,
        Picking: false,
      };
      const response = await axios.put(baseUrlUpdatePicking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        // 🔹 MISMA LÓGICA ORIGINAL (invertida)
        setRequisitionDetailsChecked((prev) => {
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

          // agregar a pendientes
          setRequisitionDetails((detailsPrev) => [...detailsPrev, item]);

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
      setIsLoading(false);
    }
  }, []);
  const handleToggleReservada = () => {
    if (!reservada) {
      // pasa de false → true
      setUsuarioReserva(Usuario);
      setFechaReserva(new Date());
    } else {
      // pasa de true → false
      setUsuarioReserva(null);
      setFechaReserva(null);
    }

    setReservada(!reservada);
  };

  const handleEditRequisitionDetail = async () => {
    const articuloExiste = requisitionDetails.find(
      (item) => item.Codigo === article.Codigo,
    );
    if (!articuloExiste) return;
    if (!cantidad || cantidad <= 0) {
      setModal(false);
      notificar(
        "top",
        `No se puede editar el artículo ${article.Codigo} con cantidad a 0`,
        "error",
        paddingTopNotification,
      );
      return;
    }
    // 🟡 Si ya existe → sumar cantidades
    if (articuloExiste) {
      if (cantidad > articuloExiste.Existencia) {
        notificar(
          "top",
          "La cantidad agregada excede la existencia disponible",
          "error",
          paddingTopNotification,
        );
        return;
      }
    }
    try {
      handleClear();
      setIsLoading(true);
      setModal(false);

      const data = {
        CodEmp: codEmp,
        numTraslado: order,
        Codigo: articuloExiste.Codigo,
        Cantidad: cantidad,
        Picking: false,
      };

      const response = await axios.put(baseUrlUpdatePicking, data, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        // 🔥 EDITA el artículo en la lista
        setRequisitionDetails((prev) =>
          prev.map((item) =>
            item.Codigo === articuloExiste.Codigo
              ? {
                  ...item,
                  Cantidad: cantidad,
                }
              : item,
          ),
        );
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

    setModal(false);
    setCantidad(1);
    setFotoArticulo("");
    setEditar(false);
  };
  const handleAddRequisitionDetail = async () => {
    try {
      // 🚫 1. No permitir servicios
      if (article?.Servicio) {
        notificar(
          "top",
          "No se pueden agregar servicios a la requisición",
          "warning",
          paddingTopNotification,
        );
        return;
      }

      // 🔎 2. Buscar en CHECKED
      const articuloChecked = requisitionDetailsChecked.find(
        (item) => item.Codigo === article.Codigo,
      );

      if (articuloChecked) {
        notificar(
          "top",
          "Debe desmarcar el artículo para poder agregar más cantidades",
          "warning",
          paddingTopNotification,
        );
        return;
      }

      // 🔎 3. Buscar en PENDIENTES
      const articuloExistente = requisitionDetails.find(
        (item) => item.Codigo === article.Codigo,
      );

      const existencia = article.Existencia ?? 0;

      // 🟡 Si ya existe → sumar cantidades
      if (articuloExistente) {
        const cantidadTotal = articuloExistente.Cantidad + cantidad;

        if (cantidadTotal > existencia) {
          notificar(
            "top",
            "La cantidad agregada excede la existencia disponible",
            "error",
            paddingTopNotification,
          );
          return;
        }
        // ✏️ Editar cantidad
        handleEditRequisitionDetail();
        handleClear();
        return;
      }

      handleClear();
      setIsLoading(true);

      const newArticle = {
        CodEmp: codEmp,
        NumTraslado: order,
        Secuencia: 0,
        Codigo: article.Codigo,
        Cantidad: cantidad,
        NombreArticulo: article.NombreArticulo,
        CodBodega: codBodegaOrigen,
        Costo: article.Costo,
        Servicio: false,
        CantidadPL: 0,
        CantidadEnv: 0,
        Picking: false,
      };

      const response = await axios.post(`${baseUrl}/${numTraslado}`, newArticle, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

        // 🔥 Agregar al estado local
        setRequisitionDetails((prev) => [
          ...prev,
          {
            ...newArticle,
            Secuencia: prev.length + 1,
            Foto: article.Foto,
            Existencia: article.Existencia,
            Ubicacion: article.Ubicacion,
          },
        ]);

        cargarInformacion();

        setModal(false);
        setCantidad(1);
        setArticle(null);
        setEditar(false);
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      console.log("❌ Error al agregar artículo:", error);
      notificar(
        "top",
        "Error al agregar el artículo a la requisición",
        "error",
        paddingTopNotification,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequisitionDetail = async (codigo) => {
    try {
      setIsLoading(true);
      // 🔥 DELETE al API (NumTraslado + Codigo)
      const response = await axios.delete(`${baseUrl}/${numTraslado}/${codigo}`, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error !== 0) {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
        return;
      }

      notificar("top", respuesta.Mensaje, "success", paddingTopNotification);

      // 🔁 Eliminar del estado local
      const detallesActualizados = requisitionDetails
        .filter((item) => item.Codigo !== codigo)
        .sort((a, b) => a.Secuencia - b.Secuencia)
        .map((item, index) => ({
          ...item,
          Secuencia: index + 1,
        }));

      setRequisitionDetails(detallesActualizados);

      // (opcional) sincronizar copia si la usas
      setRequisitionsDetailsCopy(detallesActualizados);
    } catch (error) {
      console.error("❌ Error al eliminar artículo:", error);
      notificar(
        "top",
        "Error al eliminar el artículo de la requisición",
        "error",
        paddingTopNotification,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDeleteRequisitionDetail = (codigo) => {
    Alert.alert(
      "Eliminar artículo",
      `¿Estás seguro que deseas eliminar el artículo ${codigo} de la requisición?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleDeleteRequisitionDetail(codigo),
        },
      ],
      { cancelable: true },
    );
  };
  const renderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.AlreadyAdded) {
          console.log(item.Cantidad);
          setCantidad(item.Cantidad);
          setEditar(true);
        } else {
          setEditar(false);
        }
        setExistenciaArticulo(item.Existencia);
        setArticle(item);
        setModal(true);
      }}
    >
      <Block style={styles.columnProd}>
        <CardArticle item={item} horizontal />
      </Block>
    </TouchableOpacity>
  );
  const handlePressUpdateRequisition = async () => {
    try {
      const toISO = (date) =>
        date instanceof Date && !isNaN(date.getTime())
          ? date.toISOString()
          : null;

      const fechaISO = toISO(fecha);
      const fechaReservaISO = reservada ? toISO(fechaReserva) : null;

      setIsLoading(true);

      // 🔁 Unir pendientes + checkeados
      const detalles = [
        ...requisitionDetails,
        ...requisitionDetailsChecked,
      ].sort((a, b) => a.Secuencia - b.Secuencia);

      const dataRequisition = {
        NumTraslado: order,
        Destino: destino,
        Fecha: fechaISO,
        Usuario: usuarioCreacion,
        CodBodegaOrigen: codBodegaOrigen,
        CodBodegaDestino: codBodegaDestino,
        Observaciones: observaciones,
        UsuarioReserva: usuarioReserva,
        FechaReserva: fechaReservaISO,
        Reservado: reservada,
        DetalleRequisicion: detalles,
      };
      if (destino.trim() === "") {
        notificar(
          "top",
          "El campo destino es obligatorio",
          "error",
          paddingTopNotification,
        );
        return;
      }
      if (!codBodegaOrigen || !codBodegaDestino) {
        notificar(
          "top",
          "Debe seleccionar bodegas de origen y destino",
          "error",
          paddingTopNotification,
        );
        return;
      }

      // 🔥 PUT al API (misma URL, método distinto)
      const response = await axios.put(`${baseUrl}/${numTraslado}`, dataRequisition, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
        cargarInformacion();
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      console.error("❌ Error al actualizar requisición:", error);
      notificar(
        "top",
        "Error al actualizar la requisición",
        "error",
        paddingTopNotification,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handlePressCreateRequisition = async () => {
    try {
      const toISO = (date) =>
        date instanceof Date && !isNaN(date.getTime())
          ? date.toISOString()
          : null;

      const fechaISO = toISO(fecha);
      const fechaReservaISO = reservada ? toISO(fechaReserva) : null;

      setIsLoading(true);

      const dataRequisition = {
        NumTraslado: numTraslado,
        Destino: destino,
        Fecha: fechaISO,
        Usuario: usuarioCreacion,
        CodBodegaOrigen: codBodegaOrigen,
        CodBodegaDestino: codBodegaDestino,
        Observaciones: observaciones,
        UsuarioReserva: usuarioReserva,
        FechaReserva: fechaReservaISO,
        Reservado: reservada,
        DetalleRequisicion: [],
      };
      if (destino.trim() === "") {
        notificar(
          "top",
          "El campo destino es obligatorio",
          "error",
          paddingTopNotification,
        );
        return;
      }
      if (!codBodegaOrigen || !codBodegaDestino) {
        notificar(
          "top",
          "Debe seleccionar bodegas de origen y destino",
          "error",
          paddingTopNotification,
        );
        return;
      }
      // 🔥 POST al API (misma URL, método distinto)
      const response = await axios.post(`${baseUrl}/New`, dataRequisition, {
        headers: { "content-type": "application/json" },
      });

      const respuesta = response.data;

      if (respuesta.Error === 0) {
        notificar("top", respuesta.Mensaje, "success", paddingTopNotification);
        setNumTraslado(respuesta.Data);
        InteractionManager.runAfterInteractions(() => {
          searchBarRef.current?.focus();
        });
      } else {
        notificar("top", respuesta.Mensaje, "error", paddingTopNotification);
      }
    } catch (error) {
      console.error("❌ Error al crear requisición:", error);
      notificar(
        "top",
        "Error al crear la requisición",
        "error",
        paddingTopNotification,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const formatFecha = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-GT"); // 26/01/2026
  };
  const parseDate = (value) => {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
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
              backgroundColor: "#D9F2EC",
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
                icon={"dolly"} // Cambia el icono aquí
                color="#0D7C66"
                size={16}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#0D7C66",
                }}
              >
                Requisición
              </Text>
            </Block>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 4,
                paddingHorizontal: 0,
                paddingBottom: 70,
                justifyContent: "start",
                backgroundColor: "#D9F2EC",
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
                  <Text style={styles.label}>Número de requisición:</Text>
                  <Input
                    right
                    placeholder="Número de requisición"
                    value={numTraslado.toString()}
                    editable={false}
                    iconContent={<></>}
                  />
                </Block>
                <Block style={{ flex: 1, marginRight: 2 }}>
                  <Text style={styles.label}>Fecha:</Text>
                  <Input
                    right
                    placeholder="Fecha"
                    value={formatFecha(fecha)}
                    iconContent={<></>}
                    keyboardType="numeric"
                    returnKeyType="done"
                    editable={false}
                  />
                </Block>
              </Block>
              <Block style={styles.inputContainer}>
                <Text style={styles.label}>Usuario creación:</Text>
                <Input
                  right
                  placeholder="Usuario"
                  value={usuarioCreacion}
                  iconContent={<></>}
                  keyboardType="numeric"
                  returnKeyType="done"
                  editable={false}
                />
              </Block>
              <Block style={styles.inputContainer}>
                <Text style={styles.label}>Destino (Solicitante):</Text>
                <InputAutoGrowing
                  iconContent={<Block />}
                  returnKeyType="done"
                  placeholder="Destino"
                  value={destino}
                  onChangeText={setDestino}
                  ref={observacionesRef}
                  editable={true}
                />
                {destino == "" && (
                  <Text style={styles.required}>* Obligatorio</Text>
                )}
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
                  <Text style={styles.selectLabel}>Bodega Origen:</Text>
                  <Select2
                    options={optionsBodegas}
                    value={codBodegaOrigen}
                    setValue={setCodBodegaOrigen}
                    onSelect={handleSelectBodegaOrigen}
                    placeholder="- Bodega origen -"
                    doneText="Aceptar"
                  />
                  {!codBodegaOrigen && (
                    <Text style={styles.requiredSelect}>* Obligatorio</Text>
                  )}
                </Block>
                <Block
                  style={{
                    flex: 1,
                  }}
                >
                  <Text style={styles.selectLabel}>Bodega destino:</Text>
                  <Select2
                    options={optionsBodegas}
                    value={codBodegaDestino}
                    setValue={setCodBodegaDestino}
                    onSelect={handleSelectBodegaDestino}
                    placeholder="- Bodega destino -"
                    doneText="Aceptar"
                  />
                  {!codBodegaDestino && (
                    <Text style={styles.requiredSelect}>* Obligatorio</Text>
                  )}
                </Block>
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

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View style={styles.divider} />
              </View>
              <Block
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <FontAwesomeIcon
                  icon={"user-check"} // Cambia el icono aquí
                  color="#0D7C66"
                  size={16}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#0D7C66",
                  }}
                >
                  Información de reserva
                </Text>
              </Block>

              <Block style={styles.inputContainer}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 4,
                  }}
                  onPress={() => handleToggleReservada()}
                >
                  <Text size={14} color="black" bold>
                    Reservada
                  </Text>
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      marginLeft: 8,
                      borderColor: "#0D7C66",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={reservada ? "square-check" : "square"}
                      size={20}
                      color={reservada ? "#0D7C66" : "#F2F2F2"}
                    />
                  </View>
                </TouchableOpacity>
              </Block>
              {reservada && (
                <Block
                  style={[styles.inputContainer, { flexDirection: "row" }]}
                >
                  <View
                    style={{
                      flex: 1,
                      padding: 4,
                    }}
                  >
                    <Text size={14} color="black" bold>
                      Usuario reserva
                    </Text>
                    <Text>{usuarioReserva ? usuarioReserva : Usuario}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 4,
                    }}
                  >
                    <Text size={14} color="black" bold>
                      Fecha reserva
                    </Text>
                    <Text size={14}>
                      {fechaReserva
                        ? fechaReserva.toLocaleString("es-GT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </Text>
                  </View>
                </Block>
              )}
            </KeyboardAwareScrollView>
          </View>
          {numTraslado != 0 ? (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: "#D9F2EC",
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
                      icon={"clipboard-list"} // Cambia el icono aquí
                      color="#0D7C66"
                      size={16}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#0D7C66",
                      }}
                    >
                      Artículos
                    </Text>
                  </Block>
                </Block>

                <View style={{ flex: 1, width: "100%", paddingHorizontal: 8 }}>
                  {renderSearch()}
                  <Block
                    style={{
                      flex: 1,
                      width: "100%",
                      justifyContent: "flex-start",
                      overflow: "hidden",
                    }}
                  >
                    {/* 🔍 HAY RESULTADOS DE BÚSQUEDA */}
                    {searchResults.length > 0 ? (
                      <FlashList
                        data={searchResults}
                        ref={flatListRef}
                        numColumns={1}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.Codigo}
                        showsVerticalScrollIndicator
                        estimatedItemSize={200}
                        contentContainerStyle={{ paddingBottom: 10 }}
                      />
                    ) : searchText.length > 2 ? (
                      /* ❌ NO HAY RESULTADOS */
                      <Block
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          paddingVertical: 16,
                          paddingHorizontal: 16,
                          borderRadius: 10,
                          height: "100%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#0D7C66",
                          }}
                        >
                          No se encontraron resultados para "{searchText}"
                        </Text>
                      </Block>
                    ) : isLoading ? (
                      /* ⏳ CARGANDO */
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
                          style={{ width: 180, height: 180 }}
                        />
                      </View>
                    ) : (
                      /* 📦 LISTA NORMAL */
                      <RequisitionCart
                        details={requisitionDetails}
                        onToggle={handlePressCheckItem}
                        showPacking={false}
                        showCost={true}
                        showEdit={true}
                        renderEdit={(item) => (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              gap: 2,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                borderColor: "#007AFF",
                                borderWidth: 1,
                                borderRadius: 10,
                                flexDirection: "row",
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                setEditar(true);
                                setModal(true);
                                setArticle(item);
                                setCantidad(item.Cantidad);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={"file-pen"}
                                color="#007AFF"
                                size={12}
                              />
                              <Text
                                style={{
                                  color: "#007AFF",
                                  marginLeft: 5,
                                  fontSize: 12,
                                }}
                              >
                                Editar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                borderColor: "red",
                                borderWidth: 1,
                                borderRadius: 10,
                                flexDirection: "row",
                                padding: 4,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                confirmDeleteRequisitionDetail(item.Codigo);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={"trash-can"}
                                color="red"
                                size={12}
                              />
                              <Text
                                style={{
                                  color: "red",
                                  marginLeft: 5,
                                  fontSize: 12,
                                }}
                              >
                                Eliminar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    )}
                  </Block>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  //backgroundColor: "#8FD4C6",
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
                      color="#0D7C66"
                      size={16}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#0D7C66",
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
                    //backgroundColor: "#8FD4C6",
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    overflow: "hidden",
                    paddingRight: 8,
                  }}
                >
                  <View style={{ flex: 1, minHeight: 100 }}>
                    <RequisitionCart
                      details={requisitionDetailsChecked}
                      onToggle={handlePressUncheckItem}
                      showCost={true}
                    />
                  </View>
                </Block>
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: "#D9F2EC",
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
                    icon={"clipboard-list"} // Cambia el icono aquí
                    color="#0D7C66"
                    size={16}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#0D7C66",
                    }}
                  >
                    Artículos
                  </Text>
                </Block>
              </Block>
              <View style={{ flex: 1, width: "100%", paddingHorizontal: 8 }}>
                <Block
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <Block
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      borderRadius: 10,
                      height: "100%",
                    }}
                  >
                    <LottieView
                      autoPlay
                      source={EmptyCart}
                      style={{ width: 180, height: 180 }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#0D7C66",
                      }}
                    >
                      Guarda la requisicón para poder agregar artículos
                    </Text>
                  </Block>
                </Block>
              </View>
            </View>
          )}
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
        {numTraslado != 0 && (
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
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 5, // Adjust this value to control the distance from the bottom
          right: 16, // Adjust this value to control the distance from the right
        }}
      >
        {numTraslado != 0 ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              padding: 16,
              backgroundColor: "#0D7C66",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handlePressUpdateRequisition()}
          >
            <FontAwesomeIcon icon={"floppy-disk"} size={14} color="white" />
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
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              padding: 16,
              backgroundColor: "#007AFF",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => handlePressCreateRequisition()}
          >
            <FontAwesomeIcon
              icon={"file-circle-plus"}
              size={14}
              color="white"
            />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                marginLeft: 5,
              }}
            >
              Crear
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Modals
        visible={modal}
        onClose={() => {
          setModal(false);
          setCantidad(1);
          setArticle(null);
        }}
        width={isMovil ? "98%" : "45%"}
        height={isMovil ? "85%" : "100%"}
        renderFooter={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            {editar ? (
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleEditRequisitionDetail()}
              >
                <Text style={styles.textCartButton}>Guardar</Text>
                <FontAwesomeIcon icon={"floppy-disk"} size={16} color="white" />
              </TouchableOpacity>
            ) : existenciaArticulo > 0 ? (
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleAddRequisitionDetail()}
              >
                <Text style={styles.textCartButton}>Agregar</Text>
                <FontAwesomeIcon icon={"circle-plus"} size={16} color="white" />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        }
        fullScreen
      >
        {editar ? (
          <RenderEditArticle
            articulo={article}
            cantidad={cantidad}
            onCantidadChange={setCantidad}
          />
        ) : (
          <RenderViewArticle
            articulo={article}
            cantidad={cantidad}
            onCantidadChange={setCantidad}
          />
        )}
      </Modals>
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
    height: 48,
    borderRadius: 25,
    borderColor: argonTheme.COLORS.BORDER,
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
    backgroundColor: "#0D7C66",
  },
  inputStyle: {
    height: 45,
    fontSize: 15,
  },
  circle: {
    width: 25,
    height: 25,
    borderWidth: 2, // Añadimos un ancho de borde
    borderColor: "#0D7C66", // Color del borde
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D7C66", // Color del número
  },
  divider: {
    width: "90%",
    borderWidth: 0.7,
    borderColor: "#0D7C66",
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
  requiredSelect: { marginTop: 5,fontSize: 10, color: "red" },
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
    backgroundColor: "#0D7C66",
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
    padding: 5,
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
    backgroundColor: "#0D7C66",
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
    color: "#0D7C66",
  },
  focusCell: {
    //borderColor: "#000",
    borderColor: "#0D7C66",
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
    color: "#0D7C66",
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
export default NewPickingRequisition;
