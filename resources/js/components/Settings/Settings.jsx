import React from "react";
import authUser from "../authUser";
import styles from "./settings.module.css";
import iconAccSettings from "./iconAccountSettings.png";
import iconUpload from "./iconUpload.png";
import iconHistory from "./iconHistory.png";
import iconLike from "./iconLike.png";
import iconShop from "./iconShop.png";
import iconHelp from "./iconHelp.png";
import iconLogout from "./iconLogout.png";

export default function Settings() {
    const { logout } = authUser();
    return (
        <div id={styles.Settings}>
            <h1>Settings</h1>
            <ul>
                <li>
                    <img src={iconAccSettings}></img>Account settings
                </li>
                <li>
                    <img src={iconUpload}></img>Upload
                </li>
                <li>
                    <img src={iconHistory}></img>History
                </li>
                <li>
                    <img src={iconLike}></img>Liked videos
                </li>
                <li>
                    <img src={iconShop}></img>Shop
                </li>
                <li>
                    <img src={iconHelp}></img>Help
                </li>
                <li onClick={logout}>
                    <img src={iconLogout}></img>Logout
                </li>
            </ul>
        </div>
    );
}
