import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import tempIcon from "./ico.png";
import mailIcon from "./mailIcon.png";
import lockIcon from "./lockIcon.png";
import styles from "./registerOrLogin.module.css";
import useAuthContext from "../AuthContext";
export default function RegisterOrLogin({ componentType }) {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const { login } = useAuthContext();
    const { register } = useAuthContext();
    const { user, getUser } = useAuthContext();

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, []);

    const isRegister = componentType === "register";
    const isLogin = componentType === "login";

    function handleInuptEmail(e) {
        setRegisteredData({ ...registeredData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setRegisteredData({ ...registeredData, password: e.target.value });
    }

    function handleInputRepeatPassword(e) {
        setRegisteredData({
            ...registeredData,
            repeatPassword: e.target.value,
        });
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        let url;
        if (type === "login") {
            url = "http://127.0.0.1:8000/api/auth/login";
            
            navigate("/logged");
        } else if (type === "register") {
            url = "http://127.0.0.1:8000/api/auth/register";
        } else {
            throw new Error(`Invalid type: ${type}`);
        }
        await handleFetchApi(e, url);
    };

    const handleFetchApi = async (e, url) => {
        e.preventDefault();
        if (url === "http://127.0.0.1:8000/api/auth/login") {
            login(registeredData.email, registeredData.password);
        } else if (url === "http://127.0.0.1:8000/api/auth/register") {
            register(
                registeredData.email,
                registeredData.password,
                registeredData.repeatPassword
            );
        }
        // await csrf();
        // try {
        //     const response = await axios.post(url, {
        //         email: registeredData.email,
        //         password: registeredData.password,
        //     });
        //     setRegisteredData({
        //         email: "",
        //         password: "",
        //         repeatPassword: "",
        //     });
        // } catch (er) {
        //     console.log(er);
        // }
    };

    return (
        <main>
            {user?.email}
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
                    value={registeredData.email}
                    onChange={(e) => handleInuptEmail(e)}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    value={registeredData.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>
                {isRegister && (
                    <input
                        type="password"
                        placeholder="Repeat password"
                        value={registeredData.repeatPassword}
                        onChange={(e) => handleInputRepeatPassword(e)}
                    ></input>
                )}
                {isLogin && (
                    <Link to="/forgotPassword">
                        <a data-testid="forgotPassword">Forgot password?</a>
                    </Link>
                )}

                {isRegister && <button>Register</button>}
                {isLogin && <button>Login</button>}
                {isRegister && (
                    <Link to="/login" data-testid="fromRegisterToLogin">
                        I already have an account
                    </Link>
                )}
                {isLogin && (
                    <Link to="/register" data-testid="fromLoginToRegister">
                        Create account
                    </Link>
                )}
            </form>
        </main>
    );
}
