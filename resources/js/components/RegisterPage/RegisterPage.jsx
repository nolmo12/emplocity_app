import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message/Message";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./registerOrLogin.module.css";

export default function RegisterPage() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [emailValidation, setEmailValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState(false);
    const [repeatPasswordValidation, setRepeatPasswordValidation] =
        useState(false);
    const [emailVerfication, setEmailVerfication] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/api/auth/register",
                {
                    email: registeredData.email,
                    password: registeredData.password,
                    repeatPassword: registeredData.repeatPassword,
                }
            );
            setEmailVerfication(true);
        } catch (e) {
            setEmailValidation(false);
            setPasswordValidation(false);
            setRepeatPasswordValidation(false);
            console.log(e);
            const errors = e.response.data.errors;
        }
    };

    return (
        <main>
            {emailVerfication ? (
                <Message message="Email verification sent" />
            ) : (
                <form data-testid="form" onSubmit={(e) => handleSubmit(e)}>
                    <Link to="/">
                        {iconPath && <img src={iconPath} alt="Icon"></img>}
                    </Link>

                    <input
                        id={styles.Email}
                        className={emailValidation ? styles.invalid : ""}
                        type="text"
                        placeholder="Email"
                        value={registeredData.email}
                        onChange={(e) => handleInuptEmail(e)}
                    ></input>

                    {emailValidation ? (
                        <p>Invalid or used by other user</p>
                    ) : (
                        ""
                    )}
                    <input
                        id={styles.Password}
                        className={passwordValidation ? styles.invalid : ""}
                        type="password"
                        placeholder="Password"
                        value={registeredData.password}
                        onChange={(e) => handleInputPassword(e)}
                    ></input>

                    {passwordValidation ? <p>Invalid password</p> : ""}
                    <input
                        id={styles.RepeatPassword}
                        className={
                            repeatPasswordValidation ? styles.invalid : ""
                        }
                        type="password"
                        placeholder="Repeat password"
                        value={registeredData.repeatPassword}
                        onChange={(e) => handleInputRepeatPassword(e)}
                    ></input>
                    {repeatPasswordValidation ? (
                        <p>Not the same as password</p>
                    ) : (
                        ""
                    )}

                    <button>Register</button>

                    <Link to="/login">I already have an account</Link>
                </form>
            )}
        </main>
    );
}
