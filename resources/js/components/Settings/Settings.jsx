import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    faInfoCircle,
    faGavel,
} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
    const { logout, isLogged, getUser } = authUser();
    const [historyPath, setHistoryPath] = useState();
    const [likedPath, setLikedPath] = useState();

    useEffect(() => {
        if (!isLogged()) {
            return;
        } else {
            const getUserData = async () => {
                // wait for token update
                await new Promise((resolve) => setTimeout(resolve, 50));
                const user = await getUser();
                setHistoryPath(`/history/${user.id}`);
                setLikedPath(`/user-likes/${user.id}`);
            };
            getUserData();
        }
    }, [historyPath, likedPath]);

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
                    <Link to="/shop" className={styles.link}>
                        Shop
                    </Link>
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
                <li>
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        className={styles.settingsIcon}
                    />
                    <Link to="/about-us" className={styles.link}>
                        About us
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faGavel}
                        className={styles.settingsIcon}
                    />
                    <Link to="/rules" className={styles.link}>
                        Rules
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
