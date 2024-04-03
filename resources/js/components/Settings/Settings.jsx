import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import styles from "./settings.module.css";
import fetchImage from "../fetchImgFromStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faUser,
    faHistory,
    faQuestionCircle,
    faThumbsUp,
    faStore,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
    const [iconAccountSettingsPath, setIconAccountSettingsPath] = useState("");
    const [iconUploadPath, setIconUploadPath] = useState("");
    const [iconHistoryPath, setIconHistoryPath] = useState("");
    const [iconLikePath, setIconLikePath] = useState("");
    const [iconShopPath, setIconShopPath] = useState("");
    const [iconHelpPath, setIconHelpPath] = useState("");
    const [iconLogoutPath, setIconLogoutPath] = useState("");

    const { logout } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    iconAccountSettingsPath,
                    iconUploadPath,
                    iconHistoryPath,
                    iconLikePath,
                    iconShopPath,
                    iconHelpPath,
                    iconLogoutPath,
                ] = await Promise.all([
                    fetchImage("iconAccountSettings.png"),
                    fetchImage("iconUpload.png"),
                    fetchImage("iconHistory.png"),
                    fetchImage("iconLike.png"),
                    fetchImage("iconShop.png"),
                    fetchImage("iconHelp.png"),
                    fetchImage("iconLogout.png"),
                ]);
                setIconAccountSettingsPath(iconAccountSettingsPath);
                setIconUploadPath(iconUploadPath);
                setIconHistoryPath(iconHistoryPath);
                setIconLikePath(iconLikePath);
                setIconShopPath(iconShopPath);
                setIconHelpPath(iconHelpPath);
                setIconLogoutPath(iconLogoutPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div id={styles.Settings}>
            <h1>Settings</h1>
            <ul data-testid="settingsList">
                <li>
                    <FontAwesomeIcon 
                        icon={faUser} 
                        className={styles.settingsIcon} 
                    />
                    Account settings
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faUpload}
                        className={styles.settingsIcon}
                    />
                    <Link to="/upload" className={styles.link}>Upload</Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faHistory}
                        className={styles.settingsIcon}
                    />
                    History
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faThumbsUp}
                        className={styles.settingsIcon}
                    />
                    Liked videos
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faStore}
                        className={styles.settingsIcon}
                    />
                    Shop
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className={styles.settingsIcon}
                    />
                    Help
                </li>
                <li onClick={logout}>
                    <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className={styles.settingsIcon}
                    />
                    Logout
                </li>
            </ul>
        </div>
    );
}
