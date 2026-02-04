// orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    customer: [],
    orderDetails: [],
  },
  reducers: {
    //Reducer configurado para agregar un cliente al nuevo pedido
    addCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearCustomer: (state, action) => {
      state.customer = [];
    },
    AddOrderDetail: (state, action) => {
      state.orderDetails = action.payload;
    },
    addArticle: (state, action) => {
      state.orderDetails.push(action.payload);
    },
    deleteArticle: (state, action) => {
      const codigoToRemove = action.payload;
      const newRows = state.orderDetails.filter(
        (product) => product.Codigo !== codigoToRemove
      );
      state.orderDetails = newRows;
    },
    updateArticle: (state, action) => {
      const updatedItem = action.payload; // Objeto modificado recibido como payload
      const updatedOrderDetails = state.orderDetails.map((item) => {
        // Mapeamos los detalles del pedido
        if (item.Codigo === updatedItem.Codigo) {
          // Si encontramos el objeto que queremos actualizar
          return updatedItem;
        }
        return item; // Para otros objetos, devolvemos el objeto sin cambios
      });

      return {
        ...state,
        orderDetails: updatedOrderDetails, // Asignamos el arreglo actualizado de detalles del pedido
      };
    },
    updateCheckedArticle: (state, action) => {
      const { Codigo, Traslado } = action.payload;

      const item = state.orderDetails.find((item) => item.Codigo === Codigo);

      if (item) {
        item.Traslado = Traslado;
      }
    },
    updateOrderDetail: (state, action) => {
      state.orderDetails = action.payload;
    },
    clearOrderDetail: (state, action) => {
      state.orderDetails = [];
    },
    clearOrder: (state) => {
      state.customer = [];
      state.orderDetails = [];
    },
  },
});

export const {
  addCustomer,
  clearCustomer,
  AddOrderDetail,
  addArticle,
  deleteArticle,
  updateArticle,
  updateCheckedArticle,
  updateOrderDetail,
  clearOrder,
  clearOrderDetail,
} = orderSlice.actions;

export default orderSlice.reducer;
