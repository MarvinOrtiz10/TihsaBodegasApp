// services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Server } from "../settings/AppSettings";

const ServerIp = Server.Ip;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ServerIp}/api/`,
  }),
  tagTypes: ["Customers", "Articles", "Address", "Plannings", "Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ codEmp, usuario }) => `PuntoVenta/${codEmp}/${usuario}`,
      keepUnusedDataFor: 60,
      providesTags: (result, error, codEmp) => [{ type: "Orders", id: codEmp }],
    }),
    getOrdersHistory: builder.query({
      query: ({ codEmp, usuario }) => `PuntoVenta/HistorialPedidos/${codEmp}/${usuario}`,
      keepUnusedDataFor: 900,
      providesTags: (result, error, codEmp) => [{ type: "Orders", id: codEmp }],
    }),
    createNewOrder: builder.mutation({
      query: (newOrder) => ({
        url: "PuntoVenta/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),
    DeleteOrder: builder.mutation({
      query: (numOrden) => ({
        url: `PuntoVenta/Pedidos/${numOrden}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    getCustomers: builder.query({
      query: (codEmp) => `PuntoVenta/SelectAllClientes/${codEmp}`,
      keepUnusedDataFor: 60,
      providesTags: (result, error, codEmp) => [{ type: "Orders", id: codEmp }],
    }),
    getAllCustomers: builder.query({
      query: (codEmp) => `PuntoVenta/Clientes/All/${codEmp}`,
      keepUnusedDataFor: 43200,
      providesTags: (result, error, codEmp) => [
        { type: "Customers", id: codEmp },
      ],
    }),
    getArticles: builder.query({
      query: ({ codEmp, codigoBodega }) =>
        `AppBodegas/Articles/${codigoBodega}`,
      keepUnusedDataFor: 60,
      providesTags: (result, error, codEmp) => [{ type: "Orders", id: codEmp }],
    }),
    getArticlesSale: builder.query({
      query: () => `PuntoVenta/Articulos/Home`,
      keepUnusedDataFor: 43200,
      providesTags: (result, error, codEmp) => [
        { type: "Articles", id: codEmp },
      ],
    }),
    getPlanificacionActiva: builder.query({
      query: ({ usuario, fechaActual }) =>
        `PuntoVenta/PlanificacionSemanal/PorFecha/${usuario}/${fechaActual}`,
      keepUnusedDataFor: 3600,
      providesTags: (result, error, codEmp) => [
        { type: "Plannings", id: codEmp },
      ],
    }),
    getMetaVendedor: builder.query({
      query: ({ codigoVendedor, resumen, añoActual, mesActual }) =>
        `PuntoVenta/MetaVendedor/${codigoVendedor}/1/${resumen}/${añoActual}/${mesActual}/0`,
      keepUnusedDataFor: 3600,
      providesTags: (result, error, codEmp) => [
        { type: "Plannings", id: codEmp },
      ],
    }),
    getAllArticles: builder.query({
      query: ({codEmp, codBodega}) => `PuntoVenta/SelectArticulosBodega/${codEmp}/${codBodega}`,
      keepUnusedDataFor: 86400,
      providesTags: (result, error, codEmp) => [
        { type: "Articles", id: codEmp },
      ],
    }),
    getVendedores: builder.query({
      query: () => `AppBodegas/Lista/Vendedores`,
      keepUnusedDataFor: 86400,
    }),
    getBodegas: builder.query({
      query: () => `AppBodegas/Lista/Bodegas`,
      keepUnusedDataFor: 86400,
    }),
    getFormasPago: builder.query({
      query: (codEmp) => `PuntoVenta/SelectFormasPago/${codEmp}`,
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersHistoryQuery,
  useCreateNewOrderMutation,
  useDeleteOrderMutation,
  useGetCustomersQuery,
  useGetAllCustomersQuery,
  useGetAllArticlesQuery,
  useGetArticlesQuery,
  useGetArticlesSaleQuery,
  useGetPlanificacionActivaQuery,
  useGetMetaVendedorQuery,
  useGetVendedoresQuery,
  useGetBodegasQuery,

  useGetFormasPagoQuery,
} = api;
