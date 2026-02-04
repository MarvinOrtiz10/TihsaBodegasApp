import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/User/UserSlice";
import ordersReducer from "../Features/Order/OrderSlice";
import { api } from "../../services/Api.js";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    user: userReducer, // Agrega el slice del usuario aquí
    order: ordersReducer, // agrega valores a la orden del usuario
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
setupListeners(store.dispatch)


export default store;
