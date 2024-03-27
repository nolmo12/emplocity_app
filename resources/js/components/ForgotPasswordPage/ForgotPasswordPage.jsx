import React from "react";
import { Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import Message from "../Message/Message";
import fetchImage from "../fetchImgFromStorage";
import styles from "./forgotPassword.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPasswordPage() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [passwordWasSent, setPasswordWasSent] = useState(false);
    const [emailValidation, setEmailValidation] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const { http } = authUser();

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

    function handleInputEmail(e) {
        setLoginData({ ...loginData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setLoginData({ ...loginData, password: e.target.value });
    }

    function handleInputRepeatPassword(e) {
        setLoginData({ ...loginData, repeatPassword: e.target.value });
    }

    const handleSendEmail = async (e) => {
        e.preventDefault(); // wait for backend
        try {
            http.post("/api/auth/forgot-password", {
                email: loginData.email,
            });
            setPasswordWasSent(true);
        } catch (error) {
            setEmailValidation(true);
            console.log(error);
        }
    };

    return (
        <main>
            {passwordWasSent ? (
                <Message message="Link sent. Check your mail." className={styles.Message}/>
            ) : (
                <form onSubmit={(e) => handleSendEmail(e)} className={styles.formForgotPass}>
                    <Link to="/">
                        {iconPath && (
                            <img
                                src={iconPath}
                                data-testid="icon"
                                alt="Icon"
                            ></img>
                        )}
                    </Link>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.mailIcon}/>
                        <input
                            type="text"
                            onChange={(e) => handleInputEmail(e)}
                            placeholder="Email"
                        ></input>
                    </div>
                    {emailValidation ? <p>Invalid email</p> : ""}
                    <button>Send</button>
                </form>
            )}
        </main>
    );
}
