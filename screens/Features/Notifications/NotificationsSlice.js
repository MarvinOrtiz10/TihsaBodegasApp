// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const NotificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    addNotifications: (state, action) => {
      state.push(action.payload);
    },
    clearNotifications: (state, action) => {
      return [];
    },
    // Otras acciones del usuario
  },
});

export const { addNotifications, clearNotifications } =
  NotificationSlice.actions;

export default NotificationSlice.reducer;
