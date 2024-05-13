import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useReport from "../useReport";
import styles from "./reportPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ReportPage({ id }) {
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const { type, reference_code } = useParams();
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
    return (
        <main>
            <div className={styles.reportForm}>
                <h3>{type} report</h3>
                {type === "video" && <p>Video Reference code: {reference_code}</p>}
                {type === "user" && <p>User ID: {reference_code}</p>}
                {type === "comment" && <p>Comment ID: {reference_code}</p>}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className={styles.reportFormIcon}
                        />
                        <input
                            onChange={(e) => handleChangeEmail(e)}
                            type="text"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faAlignLeft}
                            className={styles.reportFormIcon}
                        />
                        <textarea
                            onChange={(e) => handleChangeTextarea(e)}
                            placeholder="Describe your problem"
                            rows="5"
                        />
                    </div>

                    <button>Send</button>
                </form>
            </div>
        </main>
    );
}
