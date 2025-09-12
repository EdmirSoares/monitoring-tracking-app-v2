import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const authenticatedInstance = axios.create({
    baseURL: "",
});

export const unAuthenticatedInstance = axios.create({
    baseURL: "",
});

authenticatedInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth.token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log(`Request error in authenticatedInstance: ${error}`);
        return Promise.reject(error);
    }
);
