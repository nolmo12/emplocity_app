import React from "react";
import { useState } from "react";
import authUser from "../authUser";
import styles from "./uploadPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faFilm,
    faTags,
    faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadPage() {
    const [data, setData] = useState({
        title: "",
        tags: "",
        description: "",
        language: "",
        video: "",
        thumbnail: "",
        visibility: "Public",
    });
    const { http } = authUser();

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleDroppedFile(files);
    };

    const handleDroppedFile = (files) => {
        setData({ ...data, video: files[0] });
    };

    const handleSubmit = async (e) => {
        const file = e.target;
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("language", data.language);
            formData.append("video", data.video);
            formData.append("visibility", data.visibility);
            formData.append("thumbnail", data.thumbnail);
            const response = await http.post("/api/video/upload", formData);
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

    function handleVisibility(e) {
        setData({ ...data, visibility: e.target.value });
    }

    console.log(data);
    return (
        <main>
            <form
                data-testid="uploadFormWithoutInput"
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onSubmit={(e) => handleSubmit(e)}
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
                        onChange={(e) => handleInupt("tags", e)}
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
                        onChange={(e) => handleThumbnail(e)}
                        className={styles.thumbnailInput}
                    />
                </div>

                <div>
                    <h2>Visibility: </h2>
                    <select onChange={(e) => handleVisibility(e)}>
                        <option value="Public">Public</option>
                        <option value="Unlisted">Unlisted</option>
                        <option value="Hidden">Hidden</option>
                    </select>
                </div>

                <button>Submit</button>
            </form>
        </main>
    );
}
