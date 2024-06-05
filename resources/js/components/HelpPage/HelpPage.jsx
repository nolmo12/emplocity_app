import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import authUser from "../authUser";
import styles from "./helpPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAlignLeft,
    faEnvelope,
    faQuestionCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function HelpPage() {
    const [content, setContent] = useState("");
    const textareaRef = useRef(null);
    const [problemType, setProblemType] = useState("");
    const [email, setEmail] = useState("");
    const { http, setError } = authUser();

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    const handleChangeProblemType = (e) => {
        setProblemType(e.target.value);
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleClickSend = async (e) => {
        try {
            const response = http.post("/api/email/help", {
                email: email,
                content: content,
                type: problemType,
            });
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        textarea.addEventListener("input", adjustHeight);
        adjustHeight();

        return () => {
            textarea.removeEventListener("input", adjustHeight);
        };
    }, []);

    return (
        <>
            <div className={styles.helpFormContainer}>
                <div className={styles.helpForm}>
                    <Link to="/home">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={styles.helpFormCloseIcon}
                        />
                    </Link>
                    <div>
                        <h2>Help form</h2>
                    </div>
                    <form data-testid="problemForm">
                        <div>
                            <div className={styles.inputWrapper}>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className={styles.helpFormIcon}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    onChange={(e) => handleChangeEmail(e)}
                                    className={styles.floatingInput}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <FontAwesomeIcon
                                    icon={faQuestionCircle}
                                    className={styles.helpFormIcon}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter problem type"
                                    onChange={(e) => handleChangeProblemType(e)}
                                    className={styles.floatingInput}
                                ></input>
                            </div>
                            <div className={styles.inputWrapper}>
                                <FontAwesomeIcon
                                    icon={faAlignLeft}
                                    className={styles.helpFormDescriptionIcon}
                                />
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Describe your problem"
                                    data-testid="problemInput"
                                    className={styles.descriptionArea}
                                    onChange={(e) => handleChangeContent(e)}
                                />
                            </div>
                        </div>
                        <button onClick={(e) => handleClickSend(e)}>
                            Send
                        </button>
                    </form>
                    <h2 className={styles.contact}>Contact</h2>
                    <ul data-testid="ulHelp">
                        Email: <li>pomocsznyca@gmail.com</li>
                        Phone: <li>123-456-789</li>
                        Address: <li>ul. Kozia 1, 00-001 Warszawa</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
