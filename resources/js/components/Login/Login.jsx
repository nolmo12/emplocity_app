import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./registerOrLogin.module.css";

export default function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [loginValidation, setLoginValidation] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const { http, setToken, getToken, isLogged } = authUser();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const iconPath = await fetchImage("ico.png");
                setIconPath(iconPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    function handleInuptEmail(e) {
        setLoginData({ ...loginData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setLoginData({ ...loginData, password: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoginValidation(false);
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
                setLoginValidation(true);
            });
    };

    return (
        <main>
            <form data-testid="form" onSubmit={(e) => handleSubmit(e)}>
                <Link to="/">
                    {iconPath && <img src={iconPath} alt="Icon"></img>}
                </Link>

                <input
                    id={styles.Email}
                    type="text"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => handleInuptEmail(e)}
                ></input>
                <input
                    id={styles.Password}
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>
                {loginValidation ? <p>Invalid email or password</p> : ""}
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
