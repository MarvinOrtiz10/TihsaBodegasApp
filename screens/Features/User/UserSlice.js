// UserSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const UserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.push(action.payload);
    },
    updateIdCart: (state, action) => {
      const newIdCart = action.payload;

      // Verificamos si el estado existe
      if (state.length !== 0) {
        // Si existe, actualizamos la propiedad IdCart o la creamos si no existe
        state[0].IdCart = newIdCart;
      }
    },
    clearUser: (state, action) => {
      return [];
    },
    // Otras acciones del usuario
  },
});

export const { setUser, updateIdCart, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
