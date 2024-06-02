import React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useReport from "../useReport";
import styles from "./reportPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ReportPage({ id }) {
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const { type, reference_code } = useParams();
    const textareaRef = useRef(null);
    const { sendReport } = useReport();
    // when type is "user" reference_code is user_id,  when type is "comment" reference_code is comment_id
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleChangeTextarea = (e) => {
        setContent(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        sendReport(type, reference_code, content);
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
        <main className={styles.reportPage}>
            <div className={styles.reportFormContainer}>
                <div className={styles.reportForm}>
                        <Link to="/home">
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={styles.reportFormCloseIcon}
                            />
                        </Link>
                    <h3>{type} report</h3>
                    {type === "video" && <p>Video Reference code: {reference_code}</p>}
                    {type === "user" && <p>User ID: {reference_code}</p>}
                    {type === "comment" && <p>Comment ID: {reference_code}</p>}
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className={styles.inputContainer}>
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className={styles.reportFormIcon}
                            />
                            <input
                                onChange={(e) => handleChangeEmail(e)}
                                type="text"
                                placeholder="Email"
                                className={styles.floatingInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <FontAwesomeIcon
                                icon={faAlignLeft}
                                className={styles.reportFormDescriptionIcon}
                            />
                            <textarea
                                ref={textareaRef}
                                onChange={(e) => handleChangeTextarea(e)}
                                placeholder="Describe your problem"
                                className={styles.floatingInput}
                            />
                        </div>

                        <button>Send</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
