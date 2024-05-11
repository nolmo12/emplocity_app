import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function authUser() {
    const [csrfToken, setCsrfToken] = useState();
    const navigate = useNavigate();
    const { baseUrl } = config();

    const getToken = () => {
        const token = Cookies.get("token");
        return token;
    };

    const [token, setToken] = useState(getToken());

    const http = axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    const getCsrfToken = () => {
        const token = Cookies.get("XSRF-TOKEN");
        return token;
    };

    useEffect(() => {
        http.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }, [token]);

    const saveToken = (tempToken, time) => {
        const date = new Date(); // time from api
        const tempTime = Number(date.getTime() + time);
        date.setTime(tempTime);
        Cookies.set("token", tempToken, {
            expires: date,
        });
        setToken(tempToken);
    };

    const logout = () => {
        Cookies.remove("token");
        navigate("/");
    };

    const isLogged = () => {
        const tempToken = getToken();
        if (tempToken) {
            return true;
        } else {
            return false;
        }
    };

    return {
        setToken: saveToken,
        logout,
        getToken,
        http,
        isLogged,
        getCsrfToken,
    };
}
