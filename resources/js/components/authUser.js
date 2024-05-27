import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function useAuth() {
    const navigate = useNavigate();
    const { baseUrl } = config();

    const getToken = () => Cookies.get("token");
    const getRefreshToken = () => Cookies.get("refresh_token");

    const [token, setToken] = useState(getToken());
    const [refreshToken, setRefreshToken] = useState(getRefreshToken());

    useEffect(() => {
        setToken(getToken());
        setRefreshToken(getRefreshToken());
    }, []);

    const http = axios.create({
        baseURL: baseUrl,
    });

    http.interceptors.request.use(
        async (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            config.withCredentials = true;
            return config;
        },
        (error) => Promise.reject(error)
    );
    // nie wiem skonczone na withCredentials nie przepuszcza lini 40 blad 401
    const refreshJWT = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/refresh`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getRefreshToken()}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error during token refresh", error);
        }
    };

    http.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    const response = await refreshJWT();
                    console.log("Response", response);
                    if (response) {
                        const newToken = response.authorisation.token;
                        console.log("New token", newToken);
                        saveToken(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    const saveToken = (tempToken) => {
        const expires = new Date(new Date().getTime() + 10000); // 5 minutes
        setToken(tempToken);
        Cookies.set("token", tempToken, { expires });
    };

    const saveRefreshToken = (refreshToken) => {
        setRefreshToken(refreshToken);
        Cookies.set("refresh_token", refreshToken);
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("refresh_token");
        setToken(null);
        setRefreshToken(null);
        navigate("/");
    };

    const isLogged = () => !!token || !!refreshToken;

    return {
        setToken: saveToken,
        setRefreshToken: saveRefreshToken,
        logout,
        getToken,
        http,
        isLogged,
    };
}
