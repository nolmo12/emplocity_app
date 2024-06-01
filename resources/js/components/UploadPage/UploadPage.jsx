import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./uploadPage.module.css";
import authUser from "../authUser";
import useValidation from "../useValidation";
import Message from "../Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faFilm,
    faTags,
    faAlignLeft,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadPage() {
    const uploadAreaRef = useRef(null);
    const textareaRef = useRef(null);
    const [droppedFileName, setDroppedFileName] = useState("");
    const [draggingOver, setDraggingOver] = useState(false);
    const [videoSent, setVideoSent] = useState(false);
    const [data, setData] = useState({
        title: "",
        tags: [],
        description: "",
        language: "1",
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
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("language", data.language);
            formData.append("video", data.video);
            data.tags.forEach((tag, index) => {
                console.log(tag);
                formData.append(`tags[${index}]`, tag);
            });
            formData.append("visibility", data.visibility);
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            if (data.description) {
                formData.append("description", data.description);
            }

            try {
                await http.post("/api/video/upload", formData);
            } catch (error) {
                console.log(error);
            }

            setVideoSent(true);
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data.errors;
                const validationResult = validateForm("upload", errors);
                setValidationInfo(validationResult);
            } else {
                console.error("Error occurred, but no error data was received");
            }
        }
    };

    const handleInputChange = (name, value) => {
        setData({ ...data, [name]: value });
    };

    const handleThumbnailChange = (e) => {
        setData({ ...data, thumbnail: e.target.files[0] });
    };

    const handleClearThumbnail = () => {
        setData({ ...data, thumbnail: null });
        document.getElementById("thumbnail-input").value = "";
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(" ");
        setData({ ...data, tags: tagsArray });
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
        <main className={styles.videoUploadPage}>
            <div className={styles.overlay}>
                {videoSent ? (
                    <Message message={"Video has been sent"} />
                ) : (
                    <form
                        data-testid="upload-area"
                        onSubmit={handleSubmit}
                        className={styles.uploadForm}
                    >
                        <Link to="/home">
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
                        {droppedFileName && (
                            <p>Uploaded file: {droppedFileName}</p>
                        )}
                        {validationInfo && validationInfo.videoValidation && (
                            <p className={styles.validationInfo}>
                                The video field is required
                            </p>
                        )}
                        <div className={styles.videoUploadInfo}>
                            <div className={styles.inputContainer}>
                                <FontAwesomeIcon
                                    icon={faFilm}
                                    className={styles.uploadFormIcon}
                                />
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        handleInputChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Title"
                                    className={styles.floatingInput}
                                />
                                {validationInfo &&
                                    validationInfo.titleValidation && (
                                        <p className={styles.validationInfo}>
                                            The title field is required
                                        </p>
                                    )}
                            </div>
                            <div className={styles.inputContainer}>
                                <FontAwesomeIcon
                                    icon={faTags}
                                    className={styles.uploadFormIcon}
                                />
                                <input
                                    type="text"
                                    onChange={handleTagsChange}
                                    placeholder="Tags"
                                    className={styles.floatingInput}
                                />
                                <p>
                                    Tags must be separated by space (e.g.,
                                    "polishboy warsaw")
                                </p>
                            </div>
                            <div className={styles.inputContainer}>
                                <FontAwesomeIcon
                                    icon={faAlignLeft}
                                    className={styles.uploadFormIcon}
                                />
                                <textarea
                                    ref={textareaRef}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Description"
                                    className={styles.descriptionArea}
                                ></textarea>
                            </div>
                            <div className={styles.inputContainer}>
                                <select
                                    className={styles.languageSelect}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "language",
                                            e.target.value
                                        )
                                    }
                                    data-testid="language-select"
                                    defaultValue="1"
                                >
                                    <option value="" disabled hidden>
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
                            <div className={styles.thumbnailContainer}>
                                <p className={styles.uploadFormOption}>
                                    Thumbnail:{" "}
                                </p>
                                <input
                                    type="file"
                                    id="thumbnail-input"
                                    onChange={handleThumbnailChange}
                                    className={styles.thumbnailInput}
                                />
                                {data.thumbnail && (
                                    <div
                                        className={
                                            styles.thumbnailPreviewContainer
                                        }
                                    >
                                        <img
                                            src={URL.createObjectURL(
                                                data.thumbnail
                                            )}
                                            alt="Thumbnail Preview"
                                            className={styles.thumbnailPreview}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleClearThumbnail}
                                            className={
                                                styles.clearThumbnailButton
                                            }
                                        >
                                            Clear Thumbnail
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className={styles.uploadFormOption}>
                                    Visibility:{" "}
                                </p>
                                <select
                                    onChange={(e) =>
                                        handleInputChange(
                                            "visibility",
                                            e.target.value
                                        )
                                    }
                                    data-testid="visibility-select"
                                    className={styles.visibilitySelect}
                                >
                                    <option value="Public">Public</option>
                                    <option value="Unlisted">Unlisted</option>
                                    {isLogged() && (
                                        <option value="Hidden">Hidden</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
