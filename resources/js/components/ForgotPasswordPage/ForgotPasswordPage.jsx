import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authUser from "../authUser";
import Message from "../Message/Message";
import fetchImgFromStorage from "../fetchImgFromStorage";
import styles from "./forgotPassword.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function ForgotPasswordPage() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [passwordSent, setPasswordSent] = useState(false);
    const [emailValidation, setEmailValidation] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const { fetchImage } = fetchImgFromStorage();
    const { http } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const iconPath = await fetchImage("ico.png");
                setIconPath(iconPath);
            } catch (error) {
                setError(error);
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
        e.preventDefault();
        try {
            http.post("/api/auth/forgot-password", {
                email: loginData.email,
            });
            setPasswordSent(true);
        } catch (error) {
            setEmailValidation(true);
            setError(error);
        }
    };

    return (
        <main className={styles.forgotPasswordPageMain}>
            {passwordSent ? (
                <Message
                    message="Link sent. Check your mail."
                    className={styles.Message}
                />
            ) : (
                <form
                    onSubmit={(e) => handleSendEmail(e)}
                    className={styles.formForgotPass}
                >
                    <Link to="/home">
                        {iconPath ? (
                            <img
                                src={iconPath}
                                data-testid="icon"
                                alt="Icon"
                            ></img>
                        ) : (
                            <ClipLoader color="#000" />
                        )}
                    </Link>
                    <div>
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className={styles.mailIcon}
                        />
                        <input
                            type="text"
                            onChange={(e) => handleInputEmail(e)}
                            placeholder="Email"
                            className={styles.floatingInput}
                        ></input>
                    </div>
                    {emailValidation ? <p>Invalid email</p> : ""}
                    <button>Send</button>
                </form>
            )}
        </main>
    );
}
