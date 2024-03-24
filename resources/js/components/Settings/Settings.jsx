import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import styles from "./settings.module.css";
import fetchImage from "../fetchImgFromStorage";

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
                    <img src={iconAccountSettingsPath}></img>Account settings
                </li>
                <li>
                    <img src={iconUploadPath}></img>
                    <Link to="/upload">Upload</Link>
                </li>
                <li>
                    <img src={iconHistoryPath}></img>History
                </li>
                <li>
                    <img src={iconLikePath}></img>Liked videos
                </li>
                <li>
                    <img src={iconShopPath}></img>Shop
                </li>
                <li>
                    <img src={iconHelpPath}></img>Help
                </li>
                <li onClick={logout}>
                    <img src={iconLogoutPath}></img>Logout
                </li>
            </ul>
        </div>
    );
}
