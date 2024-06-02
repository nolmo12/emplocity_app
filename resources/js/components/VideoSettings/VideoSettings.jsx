import React from "react";
import { useState, useEffect, useRef } from "react";
import authUser from "../authUser";
import useVideoSettings from "../useVideoSettings";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./videoSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faFilm,
    faTags,
    faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function VideoSettings() {
    const [data, setData] = useState({
        title: "",
        description: "",
        tags: "",
        thumbnail: "",
        visibility: "Public",
    });
    const [videoObj, setVideoObj] = useState({});
    const [loaded, setIsLoaded] = useState(false);
    const [fileSelected, setFileSelected] = useState(false);
    const [titleChanged, setTitleChanged] = useState(false);
    const [descriptionChanged, setDescriptionChanged] = useState(false);
    const [tagsChanged, setTagsChanged] = useState(false);
    const [visibilityChanged, setVisibilityChanged] = useState(false);
    const [thumbnailChanged, setThumbnailChanged] = useState(false);
    const { http, isLogged } = authUser();
    const { reference_code } = useParams();
    const { sendData } = useVideoSettings();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        getVideo();
    }, []);

    const handleClickRemove = async (e) => {
        e.preventDefault();
        const repsonse = await http.delete(`/api/video/delete`, {
            params: { reference_code: reference_code },
        });
        if (repsonse.status === 200) {
            navigate("/account");
        }
    };

    const getVideo = async () => {
        const response = await http.get(`/api/video/watch/${reference_code}`);
        setVideoObj(response.data);
        setIsLoaded(true);
    };

    const handleChangeTitle = (e) => {
        setData({ ...data, title: e.target.value });
        setTitleChanged(true);
    };

    const handleChangeDescription = async (e) => {
        setData({ ...data, description: e.target.value });
        setDescriptionChanged(true);
    };

    const handleChangeVisibility = (e) => {
        setData({ ...data, visibility: e.target.value });
        setVisibilityChanged(true);
    };

    const handleChangeTags = (e) => {
        const arr = e.target.value.split(" ");
        setData((prev) => ({ ...prev, tags: arr }));
        setTagsChanged(true);
    };

    const handleChangeThumbnail = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("thumbnail", file);
        setData({ ...data, thumbnail: formData });

        const reader = new FileReader();
        reader.onload = () => {
            setVideoObj({ ...videoObj, thumbnail: reader.result });
        };
        reader.readAsDataURL(file);

        setFileSelected(true);
        setThumbnailChanged(true);
    };

    const handleClearThumbnail = () => {
        setVideoObj({ ...videoObj, thumbnail: "" });
        setFileSelected(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setThumbnailChanged(false);
    };

    const sendTag = async (e) => {
        e.preventDefault();
        sendData("tags", reference_code, data.tags, e);
        setData((prev) => ({ ...prev, tags: "" }));
        e.target.previousElementSibling.value = "";
    };

    return (
        <div className={styles.overlay}>
            {loaded && (
                <form className={styles.videoSettingsForm}>
                    <Link to="/account">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={styles.videoSettingsFormCloseIcon}
                        />
                    </Link>
                    <div>
                        <img
                            src={videoObj.thumbnail || videoObj.video.thumbnail}
                            alt="Current Thumbnail"
                            className={styles.thumbnailPreview}
                        />
                    </div>
                    <div className={styles.settingsInfo}>
                        <div className={styles.inputGroup}>
                            <FontAwesomeIcon
                                icon={faFilm}
                                className={styles.videoSettingsFormIcon}
                            />
                            <input
                                type="text"
                                onChange={(e) => handleChangeTitle(e)}
                                defaultValue={videoObj.title}
                            ></input>
                            <button
                                onClick={(e) =>
                                    sendData(
                                        "title",
                                        reference_code,
                                        data.title,
                                        e
                                    )
                                }
                                disabled={!titleChanged}
                                className={styles.actionButton}
                            >
                                Change title
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <FontAwesomeIcon
                                icon={faAlignLeft}
                                className={styles.videoSettingsFormIcon}
                            />
                            <textarea
                                type="text"
                                onChange={(e) => handleChangeDescription(e)}
                                defaultValue={videoObj.description}
                                rows="5"
                            ></textarea>
                            <button
                                onClick={(e) =>
                                    sendData(
                                        "description",
                                        reference_code,
                                        data.description,
                                        e
                                    )
                                }
                                disabled={!descriptionChanged}
                                className={styles.actionButton}
                            >
                                Change description
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <FontAwesomeIcon
                                icon={faTags}
                                className={styles.videoSettingsFormIcon}
                            />
                            <input
                                type="text"
                                onChange={(e) => handleChangeTags(e)}
                            ></input>
                            <button
                                onClick={(e) => sendTag(e)}
                                disabled={!tagsChanged}
                                className={styles.actionButton}
                            >
                                Add tag
                            </button>
                        </div>
                    </div>
                    <div className={styles.visibilityContainer}>
                        <select
                            defaultValue={videoObj.visibility}
                            onChange={(e) => handleChangeVisibility(e)}
                        >
                            <option value="Public">Public</option>
                            <option value="Unlisted">Unlisted</option>
                            {isLogged() && (
                                <option value="Hidden">Hidden</option>
                            )}
                        </select>
                        <button
                            onClick={(e) =>
                                sendData(
                                    "visibility",
                                    reference_code,
                                    data.visibility,
                                    e
                                )
                            }
                            className={styles.selectButton}
                            disabled={!visibilityChanged}
                        >
                            Change Visibility
                        </button>
                    </div>
                    <input
                        type="file"
                        onChange={(e) => handleChangeThumbnail(e)}
                        ref={fileInputRef}
                    ></input>
                    <div className={styles.thumbnailButtonContainer}>
                        <button
                            onClick={handleClearThumbnail}
                            className={styles.thumbnailButton}
                            disabled={!thumbnailChanged}
                        >
                            Clear Thumbnail
                        </button>
                        <button
                            onClick={(e) =>
                                sendData(
                                    "thumbnail",
                                    reference_code,
                                    data.thumbnail,
                                    e
                                )
                            }
                            className={styles.thumbnailButton}
                            disabled={!thumbnailChanged}
                        >
                            Change Thumbnail
                        </button>
                    </div>
                    <div className={styles.visibilityContainer}>
                        <button
                            onClick={(e) => handleClickRemove(e)}
                            className={styles.removeButton}
                        >
                            Remove video
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
