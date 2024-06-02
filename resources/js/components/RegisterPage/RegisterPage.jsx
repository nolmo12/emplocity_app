import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Message from "../Message/Message";
import useValidation from "../useValidation";
import authUser from "../authUser";
import fetchImgFromStorage from "../fetchImgFromStorage";
import styles from "./registerPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function RegisterPage() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [emailVerification, setEmailVerification] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const [validationInfo, setValidationInfo] = useState(null);
    const { http } = authUser();

    const { validateForm } = useValidation();

    useEffect(() => {
        const fetchData = async () => {
            const { fetchImage } = await fetchImgFromStorage();
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
            await http.post("/api/auth/register", {
                email: registeredData.email,
                password: registeredData.password,
                repeatPassword: registeredData.repeatPassword,
            });
            setEmailVerification(true);
        } catch (error) {
            // console.log(error);
            const errors = error.response.data.errors;
            const validationResult = validateForm("register", errors);
            setValidationInfo(validationResult);
        }
    };

    return (
        <main className={styles.registerPageMain}>
            {emailVerification ? (
                <Message message="Email verification sent" />
            ) : (
                <form
                    data-testid="form"
                    onSubmit={handleSubmit}
                    className={styles.registerForm}
                >
                    <Link to="/home">
                        {iconPath ? (
                            <img src={iconPath} alt="Icon" />
                        ) : (
                            <ClipLoader color="#000" />
                        )}
                    </Link>

                    <div>
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className={styles.registerMailIcon}
                        />
                        <input
                            id={styles.Email}
                            className={
                                validationInfo && validationInfo.emailValidation
                                    ? `${styles.invalid} ${styles.floatingInput}`
                                    : styles.floatingInput
                            }
                            type="text"
                            value={registeredData.email}
                            onChange={handleInputEmail}
                            placeholder="Email"
                        />
                    </div>

                    {validationInfo && validationInfo.emailValidation && (
                        <p className={styles.invalid}>
                            Invalid or used by other user
                        </p>
                    )}

                    <div>
                        <FontAwesomeIcon
                            icon={faLock}
                            className={styles.registerPassIcon}
                        />
                        <input
                            id={styles.Password}
                            className={
                                validationInfo &&
                                validationInfo.passwordValidation
                                    ? `${styles.invalid} ${styles.floatingInput}`
                                    : styles.floatingInput
                            }
                            type="password"
                            placeholder="Password"
                            value={registeredData.password}
                            onChange={handleInputPassword}
                        />
                    </div>

                    {validationInfo && validationInfo.passwordValidation && (
                        <p className={styles.invalid}>Invalid password</p>
                    )}

                    <div>
                        <FontAwesomeIcon
                            icon={faLock}
                            className={styles.registerPassIcon}
                        />
                        <input
                            id={styles.RepeatPassword}
                            className={
                                validationInfo &&
                                validationInfo.repeatPasswordValidation
                                    ? `${styles.invalid} ${styles.floatingInput}`
                                    : styles.floatingInput
                            }
                            type="password"
                            placeholder="Repeat password"
                            value={registeredData.repeatPassword}
                            onChange={handleInputRepeatPassword}
                        />
                    </div>

                    {validationInfo &&
                        validationInfo.repeatPasswordValidation && (
                            <p
                                data-testid="notSameAsPassword"
                                className={styles.invalid}
                            >
                                Not same as password
                            </p>
                        )}

                    <button>Register</button>

                    <Link to="/login">I already have an account</Link>
                </form>
            )}
        </main>
    );
}
