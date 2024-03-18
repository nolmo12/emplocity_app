import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";

export default function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    
    const navigate = useNavigate();
    const { http, setToken, getToken, isLogged } = authUser();

    useEffect(() => {
        if (isLogged) {
            navigate("/");
        }
    }, [isLogged]);

    function handleInuptEmail(e) {
        setLoginData({ ...loginData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setLoginData({ ...loginData, password: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        http.post("/api/auth/login", {
            email: loginData.email,
            password: loginData.password,
        })
            .then((res) => {
                setToken(res.data.authorisation.token, 500);
                navigate("/account");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <main>
            <form data-testid="form" onSubmit={(e) => handleSubmit(e)}>
                <Link to="/">
                    <img src={tempIcon} data-testid="logo" alt="Icon"></img>
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
