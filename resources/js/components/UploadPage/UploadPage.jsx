import React from "react";
import { useState, useEffect } from "react";
import fetchImage from "../fetchImgFromStorage";
import styles from "./uploadPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUpload,
    faFilm,
    faTags,
    faAlignLeft
} from "@fortawesome/free-solid-svg-icons";

export default function UploadPage() {
    const [uploadIconPath, setUploadIconPath] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uploadIconPath = await fetchImage("upload.png");
                setUploadIconPath(uploadIconPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleDroppedFile(files);
    };

    const handleDroppedFile = (files) => {
        console.log(files);
    };

    const handleSubmit = (e) => {
        const file = e.target;
        console.log(file);
    };
    return (
        <main>
            <form
                data-testid="uploadFormWithoutInput"
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={styles.uploadForm}
            >
                <FontAwesomeIcon
                    icon={faUpload}
                    className={styles.uploadIcon}
                />
                <div>
                    <FontAwesomeIcon
                        icon={faFilm} 
                        className={styles.uploadFormIcon}
                    />
                    <input
                        type="text"
                        placeholder="Title"
                    ></input>
                </div>

                <div>
                    <FontAwesomeIcon 
                        icon={faTags}
                        className={styles.uploadFormIcon}
                    />
                    <input
                        type="text"
                        placeholder="Tags"
                    ></input>
                </div>

                <div>
                    <FontAwesomeIcon 
                        icon={faAlignLeft}
                        className={styles.uploadFormIcon} 
                    />
                    <input
                        type="textarea"
                        placeholder="Description"
                    ></input>
                </div>

                <button>Submit</button>
            </form>
        </main>
    );
}
