import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function useAuth() {
    const navigate = useNavigate();
    const { baseUrl } = config();

    const getToken = () => Cookies.get("token");

    const [token, setToken] = useState(getToken());

    useEffect(() => {
        setToken(getToken());
    }, []);

    const http = axios.create({
        baseURL: baseUrl,
    });

    http.interceptors.request.use(
        async (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${getToken()}`;
            }
            config.withCredentials = true;
            return config;
        },
        (error) => Promise.reject(error)
    );

    const refreshJWT = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/refresh`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
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
                const refreshToken = getToken();
                console.log("Refresh token", refreshToken);
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
        const expires = new Date(new Date().getTime() + 1000 * 60 * 90); // 1 hour
        setToken(tempToken);
        Cookies.set("token", tempToken, { expires });
    };

    const logout = () => {
        Cookies.remove("token");
        setToken(null);
        navigate("/home");
    };

    const isLogged = () => !!token;

    return {
        setToken: saveToken,
        logout,
        getToken,
        http,
        isLogged,
    };
}
