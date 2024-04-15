import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const { http } = authUser();
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
            console.log(formData.tags);
            setVideoSent(true);
        } catch (error) {
            const errors = error.response.data.errors;
            const validationResult = validateForm("upload", errors);
            setValidationInfo(validationResult);
            console.log(validationResult);
        }
    };

    function handleInupt(name, e) {
        setData({ ...data, [name]: e.target.value });
    }

    function handleThumbnail(e) {
        setData({ ...data, thumbnail: e.target.files[0] });
    }

    function handleTags(e) {
        const arr = e.target.value.split(" ");
        setData({ ...data, tags: arr });
    }

    function handleVisibility(e) {
        setData({ ...data, visibility: e.target.value });
    }

    return (
        <main>
            {videoSent ? (
                <Message message={"Video has been sent"} />
            ) : (
                <form
                    data-testid="upload-area"
                    onSubmit={(e) => handleSubmit(e)}
                    className={styles.uploadForm}
                >
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
                        <p>The video field is required</p>
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
                            <p>The title field is required</p>
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
                        <input
                            type="textarea"
                            onChange={(e) => handleInupt("description", e)}
                            placeholder="Description"
                        ></input>
                    </div>

                    <div>
                        <FontAwesomeIcon
                            icon={faAlignLeft}
                            className={styles.uploadFormIcon}
                        />
                        <input
                            type="textarea"
                            onChange={(e) => handleInupt("language", e)}
                            placeholder="Language"
                        ></input>
                    </div>

                    <div>
                        <h2>Thumbnail: </h2>
                        <input
                            type="file"
                            data-testid="thumbnail-input"
                            onChange={(e) => handleThumbnail(e)}
                            className={styles.thumbnailInput}
                        />
                    </div>

                    <div>
                        <h2>Visibility: </h2>
                        <select
                            onChange={(e) => handleVisibility(e)}
                            data-testid="visibility-select"
                        >
                            <option value="Public">Public</option>
                            <option value="Unlisted">Unlisted</option>
                            <option value="Hidden">Hidden</option>
                        </select>
                    </div>

                    <button onClick={handleSubmit}>Submit</button>
                </form>
            )}
        </main>
    );
}
