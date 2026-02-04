// axiosConfig.js
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "./EndPoints";

const useAxiosInstance = () => {
  const userState = useSelector((state) => state.user);
  const KEY_ON_STORAGE = userState[0].Token;
  const createAxiosInstance = (token) => {
    return axios.create({
      baseURL: `${BASE_URL}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Inicializar la instancia de Axios con el token actualizado
  const axiosInstance = createAxiosInstance(KEY_ON_STORAGE);
  return axiosInstance;
};

export default useAxiosInstance;
