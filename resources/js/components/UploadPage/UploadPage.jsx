import React, { useRef, useState } from "react";
import styles from "./uploadPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faFilm,
    faTags,
    faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadPage() {
    const uploadAreaRef = useRef(null);
    const [droppedFileName, setDroppedFileName] = useState("");
    const [draggingOver, setDraggingOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleDroppedFile(files);
        setDraggingOver(false);
    };

    const handleDroppedFile = (files) => {
        if (files.length > 0) {
            setDroppedFileName(files[0].name);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDraggingOver(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target;
        console.log(file);
    };

    return (
        <main>
            <form
                data-testid="uploadFormWithoutInput"
                className={styles.uploadForm}
            >
                <div
                    ref={uploadAreaRef}
                    className={`${styles.uploadArea} ${draggingOver ? styles.draggingOver : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <FontAwesomeIcon
                        icon={faUpload}
                        className={styles.uploadIcon}
                    />
                </div>

                {droppedFileName && (
                    <p>Uploaded file: {droppedFileName}</p>
                )}

                <div>
                    <FontAwesomeIcon
                        icon={faFilm}
                        className={styles.uploadFormIcon}
                    />
                    <input type="text" placeholder="Title"></input>
                </div>

                <div>
                    <FontAwesomeIcon
                        icon={faTags}
                        className={styles.uploadFormIcon}
                    />
                    <input type="text" placeholder="Tags"></input>
                </div>

                <div>
                    <FontAwesomeIcon
                        icon={faAlignLeft}
                        className={styles.uploadFormIcon}
                    />
                    <input type="textarea" placeholder="Description"></input>
                </div>

                <div>
                    <h2>Thumbnail: </h2>
                    <input type="file" className={styles.thumbnailInput}/>
                </div>

                <div>
                    <h2>Select: </h2>
                        <select>
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="hidden">Hidden</option>
                        </select>
                </div>

                <button onClick={handleSubmit}>Submit</button>
            </form>

        </main>
    );
}
