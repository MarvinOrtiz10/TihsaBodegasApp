import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Componentes para crear las rutas de la tab
import Home from "../screens/Home/Home";
import Notifications from "../screens/Notifications/Notifications";
import ViewNotifications from "../screens/Notifications/ViewNotifications";
import store from "../screens/App/Store";
import Login from "../screens/Login/Login";
import PasswordForgot from "../screens/Login/PasswordForgot";
import { Provider } from "react-redux";
import AppSettings from "../screens/Settings/AppSettings.js";
import CheckinOrder from "../screens/Orders/Picking/CheckinOrder.js";
import PackingOrder from "../screens/Orders/Packing/PackingOrder.js";
import OrdersPacking from "../screens/Orders/Packing/Orders.js";
import PickingOrders from "../screens/Orders/Picking/Orders.js";
import Requisitions from "../screens/Requisitions/Requisitions.js";
import PickingRequisition from "../screens/Requisitions/PickingRequisition.js";
import NewPickingRequisition from "../screens/Requisitions/NewPickingRequisition.js";

const Stack = createStackNavigator();


const LoginScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función que se ejecutará cuando el inicio de sesión sea exitoso
  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    // Otras acciones que desees realizar cuando el usuario inicie sesión
  };

  return <Login onLoginSuccess={onLoginSuccess} />;
};

const MainTabScreen = () => {
 
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F8F9FE" },
      }}
    />
    <Stack.Screen
      name="View Notification"
      component={ViewNotifications}
      options={({ navigation, route }) => {
        const { params } = route;
        const { idNotification } = params;
        return {
          headerShown: false,
          cardStyle: { backgroundColor: "#F8F9FE" },
        };
      }}
    />
    <Stack.Screen name="Orders Picking" component={PickingOrders} />
    <Stack.Screen name="Picking Order" component={CheckinOrder} />
    <Stack.Screen name="Orders Packing" component={OrdersPacking} />    
    <Stack.Screen name="Packing Order" component={PackingOrder} />  
    <Stack.Screen name="Requisitions" component={Requisitions} /> 
    <Stack.Screen name="Picking requisition" component={PickingRequisition} />  
    <Stack.Screen name="New Picking requisition" component={NewPickingRequisition} />
    <Stack.Screen name="App Settings" component={AppSettings} />  
  </Stack.Navigator>
  );
};
const Screens = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Recover Account" component={PasswordForgot} />
        <Stack.Screen name="MainTab" component={MainTabScreen} />
      </Stack.Navigator>
    </Provider>
  );
};
export default Screens ;
