import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadPage.module.css";
import authUser from "../authUser";
import { Link } from "react-router-dom";
import useValidation from "../useValidation";
import Message from "../Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faFilm,
    faTags,
    faAlignLeft,
    faLanguage,
    faTimesCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadPage() {
    const uploadAreaRef = useRef(null);
    const [droppedFileName, setDroppedFileName] = useState("");
    const [draggingOver, setDraggingOver] = useState(false);
    const [videoSent, setVideoSent] = useState(false);
    const [data, setData] = useState({
        title: null,
        tags: null,
        description: null,
        language: null,
        video: null,
        thumbnail: null,
        visibility: "Public",
    });
    const [validationInfo, setValidationInfo] = useState(null);
    const navigate = useNavigate();
    const { http, isLogged } = authUser();
    const { validateForm } = useValidation();

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleDroppedFile(files);
        setDraggingOver(false);
    };

    const handleDroppedFile = (files) => {
        setData({ ...data, video: files[0] });
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

    const handleSubmit = async (e) => {
        const file = e.target;
        e.preventDefault();
        try {
            const formData = new FormData();
            if (data.title) formData.append("title", data.title);
            if (data.language) formData.append("language", data.language);
            if (data.video) formData.append("video", data.video);
            if (data.tags) {
                data.tags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }
            if (data.visibility) formData.append("visibility", data.visibility);
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            if (data.description) {
                formData.append("description", data.description);
            }

            const response = await http.post("/api/video/upload", formData);
            setVideoSent(true);
        } catch (error) {
            if (error.response && error.response.data) {
                console.log(error);
                const errors = error.response.data.errors;
                const validationResult = validateForm("upload", errors);
                setValidationInfo(validationResult);
            } else {
                console.log("Error occurred, but no error data was received");
            }
        }
    };

    function handleInupt(name, e) {
        setData({ ...data, [name]: e.target.value });
    }

    function handleThumbnail(e) {
        setData({ ...data, thumbnail: e.target.files[0] });
    }

    function handleClearThumbnail() {
        setData({ ...data, thumbnail: null });
        document.getElementById("thumbnail-input").value = "";
    }

    function handleTags(e) {
        const arr = e.target.value.split(" ");
        setData({ ...data, tags: arr });
    }

    function handleVisibility(e) {
        setData({ ...data, visibility: e.target.value });
    }

    return (
        <main className={styles.videoUploadPage}>
            <div className={styles.overlay}>
                {videoSent ? (
                    <Message message={"Video has been sent"} />
                ) : (
                    <form
                        data-testid="upload-area"
                        onSubmit={(e) => handleSubmit(e)}
                        className={styles.uploadForm}
                    >
                        <Link to="/">
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                className={styles.uploadFormCloseIcon}
                            />
                        </Link>
                        <div
                            ref={uploadAreaRef}
                            className={`${styles.uploadArea} ${
                                draggingOver ? styles.draggingOver : ""
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <FontAwesomeIcon
                                icon={faUpload}
                                className={styles.uploadIcon}
                            />
                        </div>

                        {droppedFileName && <p>Uploaded file: {droppedFileName}</p>}
                        {validationInfo && validationInfo.videoValidation && (
                            <p className={styles.validationInfo}>
                                The video field is required
                            </p>
                        )}

                        <div>
                            <FontAwesomeIcon
                                icon={faFilm}
                                className={styles.uploadFormIcon}
                            />
                            <input
                                type="text"
                                onChange={(e) => handleInupt("title", e)}
                                placeholder="Title"
                            ></input>
                            {validationInfo && validationInfo.titleValidation && (
                                <p className={styles.validationInfo}>
                                    The title field is required
                                </p>
                            )}
                        </div>

                        <div>
                            <FontAwesomeIcon
                                icon={faTags}
                                className={styles.uploadFormIcon}
                            />
                            <input
                                type="text"
                                onChange={(e) => handleTags(e)}
                                placeholder="Tags"
                            ></input>
                            <p>
                                tags must be separated by space Ex. "polishboy
                                warsaw"
                            </p>
                        </div>

                        <div>
                            <FontAwesomeIcon
                                icon={faAlignLeft}
                                className={styles.uploadFormIcon}
                            />
                            <textarea
                                onChange={(e) => handleInupt("description", e)}
                                placeholder="Description"
                                className={styles.descriptionArea}
                                rows="5"
                            ></textarea>
                        </div>

                        <div>
                            <select
                                className={styles.languageSelect}
                                onChange={(e) => handleInupt("language", e)}
                                data-testid="language-select"
                                defaultValue=""
                            >
                                <option value="" disabled selected hidden>
                                    Language
                                </option>
                                <option value="1">English</option>
                            </select>
                            {validationInfo &&
                                validationInfo.languageValidation && (
                                    <p className={styles.validationInfo}>
                                        The language field is required
                                    </p>
                                )}
                        </div>

                        <div>
                            <p className={styles.uploadFormOption}>Thumbnail: </p>
                            <input
                                type="file"
                                id="thumbnail-input"
                                onChange={(e) => handleThumbnail(e)}
                                className={styles.thumbnailInput}
                            />
                            {data.thumbnail && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(data.thumbnail)}
                                        alt="Thumbnail Preview"
                                        className={styles.thumbnailPreview}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleClearThumbnail}
                                        className={styles.clearThumbnailButton}
                                    >
                                        Clear Thumbnail
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className={styles.uploadFormOption}>Visibility: </p>
                            <select
                                onChange={(e) => handleVisibility(e)}
                                data-testid="visibility-select"
                            >
                                <option value="Public">Public</option>
                                <option value="Unlisted">Unlisted</option>
                                {isLogged() && (
                                    <option value="Hidden">Hidden</option>
                                )}
                            </select>
                        </div>

                        <button onClick={handleSubmit}>Submit</button>
                    </form>
                )}
            </div>
        </main>
    );
}
