import { object } from "prop-types";
import { Server } from "./AppSettings.js";
const ServerIp = Server.Ip;

export const BASE_URL = ServerIp;

export const Orders = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos`,
    Nombre: `Lista los pedidos colocados por el vendedor en la App`,
  },
);
export const OrdersDetail = [
  {
    EndPoint: `${ServerIp}/api/AppClientes/OrdersDetail/`,
    Nombre: `Lista el detalle del pedido del cliente `,
  },
];


export const FormasPago = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ListaSelect/FormasPago`,
    Nombre: `Lista de formas de pago disponibles en bbx `,
  },
);
export const ArticlesByCustomer = Object.freeze({
  EndPoint: `${ServerIp}/api/AppPedidos/ArticulosCliente`,
  Nombre: `Lista de artículos con precios por cliente`,
},)
  
export const Promedio = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/Clientes/Promedio`,
    Nombre: `Calculo de promedio por cliente`,
  },
);
export const NewOrder = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos`,
    Nombre: `Api para crear un nuevo pedido`,
  },
);
export const SelectOrder = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/PorCodigo`,
    Nombre: `Api para buscar un pedido por orden`,
  },
);
export const CrudRecibos = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/Recibos`,
    Nombre: `Api para consultar, crear, modificar y ver recibos`,
  },
);
export const ImprimirPDFRecibo = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ImprimirPDFRecibo`,
    Nombre: `Api para descargar recibos en pdf`,
  },
);
export const ObtenerQRRecibo = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ObtenerQR`,
    Nombre: `Api para descargar recibos en pdf`,
  },
);
export const FacturasPendientes = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/HistorialFacturasPendientes`,
    Nombre: `Api para consultar facturas pendientes por cliente`,
  },
);
export const ListaSelect = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ListaSelectString`,
    Nombre: `Api de listas opciones de diferentes select`,
  },
);
export const MetaVendedor = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/MetaVendedor`,
    Nombre: `Api para consultar las metas del vendedor`,
  },
);
export const PlanificacionSemanal = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/PlanificacionSemanal`,
    Nombre: `Api para consultar las planificaciones semanales del vendedor`,
  },
);
export const SolicitudArticulos = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/SolicitudArticulos`,
    Nombre: `Api para consultar las solicitudes de artículos por vendedor`,
  },
);
export const ForgotPasswordUser = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ChangePasswordUser`,
    Nombre: `Api para cambiar contraseña desde la app`,
  },
);
export const AuthUser = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/AuthenticateUser`,
    Nombre: `Api para solicitar cambio de contraseña desde la app`,
  },
);
export const ValidateTokenUser = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ValidateTokenUser`,
    Nombre: `Api para el token enviado al usuario para cambio de contraseña desde la app`,
  },
);
// Apis para app de clientes

export const VerifyAccount = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/VerifyAccount`,
    Nombre: `Api para verificar la cuenta del cliente`,
  },
);
export const ReSendEmailVerifyAccount = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/SendEmailVerifyAccount`,
    Nombre: `Api para re enviar el correo de verificación de cuenta del cliente`,
  },
);
export const Departaments = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/Departments`,
    Nombre: `Api para consultar los departamentos disponibles desde la app`,
  },
);
export const States = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/Municipios`,
    Nombre: `Api para consultar los municipios disponibles desde la app`,
  },
);
export const Professions = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/Profesiones`,
    Nombre: `Api para consultar las profesiones disponibles para el cliente desde la app`,
  },
);

export const CreateClient = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/CreateClient`,
    Nombre: `Api para crear clientes desde la app`,
  },
);
export const ConsultNit = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/ConsultaNitSat`,
    Nombre: `Api para consultar el NIT en la sat`,
  },
);
export const ConsultNitBBXYSAT = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/ConsultaNitBBX`,
    Nombre: `Api para consultar el NIT en el BBX y en la sat`,
  },
);
export const ConsultDPI = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/ConsultaDpiSat`,
    Nombre: `Api para consultar el DPI en la sat`,
  },
);
export const Categorys = [
  {
    EndPoint: `/api/AppClientes/Categorys/`,
    Nombre: `Lista de categorías`,
  },
];
export const SubCategorys = [
  {
    EndPoint: `/api/AppClientes/SubCategorys/`,
    Nombre: `Lista de subcategorías`,
  },
];
export const Addresses = [
  {
    EndPoint: `/api/AppClientes/Addresses/`,
    Nombre: `Lista de direcciones`,
  },
];
export const NewAddress = Object.freeze(
  {
    EndPoint: `/api/AppClientes/NewAddress`,
    Nombre: `Crea una nueva dirección`,
  },
);
export const Shippings = Object.freeze(
  {
    EndPoint: `/api/AppClientes/Shippings/`,
    Nombre: `Lista de métodos de envío`,
  },
);
export const Payments = [
  {
    EndPoint: `/api/AppClientes/Payments/`,
    Nombre: `Lista de métodos de pago`,
  },
];
/*export const NewOrder = [
  {
    EndPoint: `/api/AppClientes/NewOrder`,
    Nombre: `Api para agregar un nuevo pedido`,
  },
];*/

export const Vouchers = [
  {
    EndPoint: `/api/AppClientes/Vouchers/`,
    Nombre: `Consulta un cupón por codigo y codigo de cliente `,
  },
];
export const AddressCustomer = [
  {
    EndPoint: `/api/AppClientes/Address`,
    Nombre: `Api para consultar, actualizar o eliminar direcciones`,
  },
];
export const HomeCategory = [
  {
    EndPoint: `/api/AppClientes/HomeCategorys`,
    Nombre: `Api para consultar productos a mostrar en Home`,
  },
];

export const Banners = [
  {
    EndPoint: `/api/AppClientes/Banners`,
    Nombre: `Api para consultar banners a mostrar en Home`,
  },
];

export const Brands = [
  {
    EndPoint: `/api/AppClientes/Brands`,
    Nombre: `Api para consultar las marcas a mostrar en Home`,
  },
];

export const Metas = [
  {
    EndPoint: `/api/AppClientes/Metas`,
    Nombre: `Api para consultar las metas por año del cliente`,
  },
];
export const StoresDir = [
  {
    EndPoint: `/api/AppClientes/Bodegas`,
    Nombre: `Api para consultar las bodegas físicas para pasar a recoger`,
  },
];

export const CustomerLogo = [
  {
    EndPoint: `/api/AppClientes/Logotipo`,
    Nombre: `Api para crear un logotipo de cliente`,
  },
];

export const AllArticles = [
  {
    EndPoint: `/api/AppClientes/AllArticles/`,
    Nombre: `Api para consultar los artículos según su tipo, superClase, clase, Líneas, Grupos`,
  },
];

export const CartStock = [
  {
    EndPoint: `/api/AppClientes/ConsultarExistencias`,
    Nombre: `Api para consultar la existencia y disponibilidad de todos los artículos en el carrito`,
  },
];
export const CartSuggested = [
  {
    EndPoint: `/api/AppClientes/ConsultarSugeridos`,
    Nombre: `Api para consultar artículos a sugerir en el carrito`,
  },
];
export const Notifications = Object.freeze(
  {
    EndPoint: `/api/AppClientes/Notifications`,
    Nombre: `Api para consultar las notificaciones del cliente`,
  },
);

export const Promotions = [
  {
    EndPoint: `/api/AppClientes/Promotions`,
    Nombre: `Api para consultar las promociones activas temporales`,
  },
];

export const CountDowns = [
  {
    EndPoint: `/api/AppClientes/CountDown`,
    Nombre: `Api para consultar las cuentas regresivas activas`,
  },
];

export const CustomerCards = [
  {
    EndPoint: `/api/AppClientes/Cards`,
    Nombre: `Api para consultar las tarjetas del cliente`,
  },
];
export const Top100Articles = Object.freeze(
  {
    EndPoint: `/api/AppClientes/TopArticles`,
    Nombre: `Api para consultar el top artículos que ha comprado el cliente`,
  },
);
export const NumVisaCuotas = [
  {
    EndPoint: `/api/AppClientes/ListCuotas`,
    Nombre: `Api para consultar el número de visacuotas permitidas en la app`,
  },
];

export const Polytics = [
  {
    EndPoint: `/api/AppClientes/Polytics`,
    Nombre: `Api para consultar políticas, terminos y condiciones y preguntas frecuentes desde la app`,
  },
];
export const ImagesArticle = [
  {
    EndPoint: `/api/AppClientes/ImagesArticles`,
    Nombre: `Api para consultar imágenes de un artículo`,
  },
];
export const Seguimiento = [
  {
    EndPoint: `/api/AppClientes/Seguimiento`,
    Nombre: `Api para rastrear artículos que el cliente consulta`,
  },
];

export const ListasSelect = [
  {
    EndPoint: `/api/ListasSelect`,
    Nombre: `Api de listas opciones de diferentes select`,
  },
];
export const StatusAccount = Object.freeze(
  {
    EndPoint: `/api/AppClientes/EstadoCuenta`,
    Nombre: `Api para mostrar el estado de cuenta del cliente`,
  },
)
export const SelectCart = [
  {
    EndPoint: `/api/AppClientes/SelectCart`,
    Nombre: `Api para mostrar el carrito guardado`,
  },
];
export const UpdateCart = [
  {
    EndPoint: `/api/AppClientes/UpdateProductCart`,
    Nombre: `Api para modificar algún artículo del carrito`,
  },
];
export const AddProductCart = [
  {
    EndPoint: `/api/AppClientes/AddProductCart`,
    Nombre: `Api para agregar artículos al carrito`,
  },
];
export const DeleteProductCart = [
  {
    EndPoint: `/api/AppClientes/DeleteProductCart`,
    Nombre: `Api para eliminar un artículo del carrito`,
  },
];
export const SelectCuentasBancarias = [
  {
    EndPoint: `/api/AppClientes/SelectCuentasBancarias`,
    Nombre: `Api para consultar las cuentas bancarías de la empresa`,
  },
];
export const ObtenerFacturas = Object.freeze(
  {
    EndPoint: `/api/AppClientes/ObtenerFactura`,
    Nombre: `Api para Obtener factura de un pedido`,
  },
);
export const ObtenerExistencias = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppPedidos/ConsultaExistencias`,
    Nombre: 'Api para consultar existencias de articulos en el pedido'
  }
);
  export const PaymentsOrders = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppPedidos/Pedidos/Pagos`,
      Nombre: `Lista los pedidos pendientes de pago colocados por el vendedor en la App`,
    },
  );

  export const DetailPaymentsOrder = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppPedidos/Pedidos/OrdenPagos/PorCodigo`,
      Nombre: `Lista el detalle del pedido pendientes de pago`,
    },
  );

  // Api's para ferretExpo

  export const Regalos = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/Regalos`,
      Nombre: `Api para listar los regalos de la ferretexpo`,
    },
  );
  export const RegistroClientes = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/RegistroCliente`,
      Nombre: `Api para CRUD registro de clientes`,
    },
  );
  export const Listas = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/ListasVarias`,
      Nombre: `Api para options de listas varias`,
    },
  );
  export const Combos = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/Combos`,
      Nombre: `Api para listar los combos de la ferretexpo`,
    },
  );
  export const ArticulosFerretExpo = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/Articulos`,
      Nombre: `Api para listar los artículos de la ferretexpo por marca y orden`,
    },
  );
  export const FormasDePagoFerretExpo = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/FormasPago`,
      Nombre: `Api para listar las formas de pago de la ferretexpo`,
    },
  );
  export const ReporteVentas = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/ReporteDVentas`,
      Nombre: `Api para crear reporte de ventas de ferretexpo`,
    },
  );
  
  export const ReporteRegalos = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/ReporteDRegalos`,
      Nombre: `Api para crear reporte de regalos de ferretexpo`,
    },
  );
  export const PorcentajeRegalos = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/PorcentajesRegalos`,
      Nombre: `Api para consultar el porcentaje de regalos de ferretexpo`,
    },
  );  
  export const AcuerdoVenta = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/AcuerdoVenta`,
      Nombre: `CRUD para contratos y pedidos de ferretexpo`,
    },
  );
  export const DashboardFerretExpo =  Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/DashboardFerretexpo`,
      Nombre: `CRUD para contratos y pedidos de ferretexpo`,
    },
  );
  export const ConsultarExistenciasFerretExpo = Object.freeze(
    {
      EndPoint: `${ServerIp}:5000/api/Articulos/ConsultaExistencias`,
      Nombre: 'Api para consultar existencias de articulos en el pedido de ferretexpo',
    }
  );

  

  // Endpoints para app de bodega
  export const Login = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppPedidos/Login`,
      Nombre: `Información de usuario para iniciar sesión`,
    },
  );
  export const Pedidos = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppPedidos/HistorialPedidos`,
      Nombre: `Api para consultar pedidos por usuario`,
    },
  );
  // Apis AppBodegas
  export const PickingOrders = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas`,
      Nombre: `Api para consultar pedidos por usuario para picking y packing`,
    },
  );
  export const UpdatePicking = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Picking`,
      Nombre: `Api para actualizar el estado de picking de un pedido`,
    },
  );
  export const UpdateRequisitionPicking = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Requisiciones/Picking`,
      Nombre: `Api para actualizar el estado de picking y cantidad de una requisición`,
    },
  );
   export const UpdatePacking = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Packing/List`,
      Nombre: `Api para actualizar el estado de packing de un pedido`,
    },
  );
  export const OrderPacks = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Packs`,
      Nombre: `Api para crear paquetes por pedido`,
    },
  );
  export const ListaVendedores = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Lista/Vendedores`,
      Nombre: `Api para consultar el listado de vendedores`,
    },
  );
   export const OrderStatusPacking = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Order/Status/Packing`,
      Nombre: `Api para actualizar el packing del pedido`,
    },
  );
   export const RequisitionsList = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Requisiciones`,
      Nombre: `Api para consultar el listado de Requisiciones`,
    },
  );
  export const Requisition = Object.freeze(
    {
      EndPoint: `${ServerIp}/api/AppBodegas/Requisiciones`,
      Nombre: `Api crud para requisiciones`,
    },
  ); 
export const Articles = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppBodegas/Articles`,
    Nombre: `Lista de artículos disponibles por bodega en bbx`,
  },
);
export const ArticlesImages = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/SelectImagenes`,
    Nombre: `Lista de imágenes del artículo`,
  },
  
);
export const consultarNit = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/ConsultaNitSat`,
    Nombre: 'Api para consultar el nit en los clientes 9999 y luego en la SAT',
  }
);
export const consultarNitSAT = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/AppLogin/ConsultaNitSat`,
    Nombre: `Api para consultar el nit en la sat`,
  },
);
export const consultarDpiSat = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/Venta/ConsultaDpiSat`,
    Nombre: 'Api para consultar el dpi en la SAT',
  }
);
export const sucursales = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/SelectSucursales`,
    Nombre: 'Api para consultar las sucursales disponibles',
  }
);
export const cajasBySucursal = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/SelectCajasBodega`,
    Nombre: 'Api para consultar las cajas disponibles por sucursal',
  }
);
export const registrarCaja = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/RegistrarCaja`,
    Nombre: 'Api para registrar cajas por sucursal',
  }
);
export const modificarCaja = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/ModificarCaja`,
    Nombre: 'Api para modificar cajas por sucursal',
  }
);
export const InformacionCaja = Object.freeze(
  {
    EndPoint: `${ServerIp}/api/PuntoVenta/SelectInfoCaja`,
    Nombre: 'Api para información de la caja por id',
  }
);