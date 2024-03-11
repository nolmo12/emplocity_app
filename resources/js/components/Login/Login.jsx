import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
import AuthUser from "../AuthUser";
export default function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const { http, setToken } = AuthUser();

    function handleInuptEmail(e) {
        setLoginData({ ...loginData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setLoginData({ ...loginData, password: e.target.value });
    }

    const handleSubmit = () => {
        try {
            http.post(
                "/api/login",
                {
                    email: loginData.email,
                    password: loginData.password,
                }.then((response) => {
                    setToken(response.data.token, response.data.user);
                })
            );
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <main>
            <form
                data-testid="form"
                onSubmit={(e) => handleSubmit(e, componentType)}
            >
                <Link to="/">
                    <img src={tempIcon} alt="Icon"></img>
                </Link>

                <input
                    type="text"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => handleInuptEmail(e)}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>

                <Link to="/forgotPassword">
                    <a data-testid="forgotPassword">Forgot password?</a>
                </Link>

                <button>Login</button>

                <Link to="/register" data-testid="fromLoginToRegister">
                    Create account
                </Link>
            </form>
        </main>
    );
}
