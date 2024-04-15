import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadPage.module.css";
import authUser from "../authUser";
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
    const navigate = useNavigate();
    const { http } = authUser();

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
            formData.append("title", data.title);
            formData.append("language", data.language);
            formData.append("video", data.video);
            if (data.tags) {
                data.tags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }
            formData.append("visibility", data.visibility);
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            const response = await http.post("/api/video/upload", formData);
            setVideoSent(true);
        } catch (error) {
            console.log(error);
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

    console.log(data);
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
