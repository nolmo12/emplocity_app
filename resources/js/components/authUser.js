import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default function authUser() {
    const [token, setToken] = useState();
    const [csrfToken, setCsrfToken] = useState();
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();
    const getToken = () => {
        const token = Cookies.get("token");
        if (token) {
            const decodedToken = jwtDecode(token);
        }
        return token;
    };

    const getCsrfToken = () => {
        const token = Cookies.get("XSRF-TOKEN");
        return token;
    };

    const saveToken = (tempToken, time) => {
        const date = new Date(); // time from api
        date.setTime(date.getTime() + time * 5000);
        Cookies.set("token", tempToken, {
            path: "/",
            expires: date,
        });
        setToken(tempToken);
    };

    const logout = () => {
        Cookies.remove("token");
        setToken(null);
        navigate("/");
    };

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (getToken() && isLogged === false) {
        setIsLogged(true);
    }
    if (!getToken() && isLogged === true) {
        setIsLogged(false);
    }

    return {
        setToken: saveToken,
        logout,
        getToken,
        token,
        http,
        isLogged,
        getCsrfToken,
    };
}
