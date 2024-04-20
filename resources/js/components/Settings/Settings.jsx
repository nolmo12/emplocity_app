import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../authUser";
import styles from "./settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faUser,
    faHistory,
    faQuestionCircle,
    faThumbsUp,
    faStore,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
    const { logout } = authUser();
    const historyPath = `/history/${1}}`;
    const likedPath = `/user-likes/${1}`;

    return (
        <div id={styles.Settings}>
            <h1>Settings</h1>
            <ul data-testid="settingsList">
                <li>
                    <FontAwesomeIcon
                        icon={faUser}
                        className={styles.settingsIcon}
                    />
                    <Link to="/account-settings" className={styles.link}>
                        Account settings
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faUpload}
                        className={styles.settingsIcon}
                    />
                    <Link to="/upload" className={styles.link}>
                        Upload
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faHistory}
                        className={styles.settingsIcon}
                    />
                    <Link to={historyPath} className={styles.link}>
                        History
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faThumbsUp}
                        className={styles.settingsIcon}
                    />
                    <Link to={likedPath} className={styles.link}>
                        Liked videos
                    </Link>
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
                    <Link to="/help" className={styles.link}>
                        Help
                    </Link>
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
