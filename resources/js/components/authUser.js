import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function authUser() {
    const [csrfToken, setCsrfToken] = useState();
    const navigate = useNavigate();
    const { baseUrl } = config();

    const http = axios.create({
        baseURL: baseUrl,
    });

    const getToken = () => {
        const token = Cookies.get("token");
        return token;
    };

    useEffect(() => {
        http.defaults.headers.Authorization = `Bearer ${getToken()}`;
    }, [getToken]);

    const getCsrfToken = () => {
        const token = Cookies.get("XSRF-TOKEN");
        return token;
    };

    const saveToken = (tempToken, time) => {
        const date = new Date(); // time from api
        date.setTime(date.getTime() + time * 5000);
        Cookies.set("token", tempToken, {
            expires: date,
        });
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

    const getUser = async () => {
        try {
            const response = await http.get("/api/user");
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        setToken: saveToken,
        logout,
        getToken,
        http,
        isLogged,
        getCsrfToken,
        getUser,
    };
}
