import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./LoginPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {    
    faEnvelope,
    faLock
} from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
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
            <form data-testid="form" onSubmit={(e) => handleSubmit(e)} className={styles.loginForm}>
                <Link to="/">
                    {iconPath && (
                        <img src={iconPath} data-testid="icon" alt="Icon"></img>
                    )}
                </Link>
                
                <div>
                    <FontAwesomeIcon icon={faEnvelope} className={styles.loginMailIcon}/>
                    <input
                        id={styles.Email}
                        type="text"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => handleInuptEmail(e)}
                    ></input>
                </div>

                <div>
                    <FontAwesomeIcon icon={faLock} className={styles.loginPassIcon}/>
                    <input
                        id={styles.Password}
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => handleInputPassword(e)}
                    ></input>
                </div>
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
