import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "../authUser";
import useUserSettings from "../useUserSettings";
import styles from "./accountSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { render } from "@testing-library/react";

export default function AccountSettings() {
    const navigate = useNavigate();
    const { getUser, logout } = authUser();
    const { changeNickname, changePassword, changeAvatar } = useUserSettings();
    const [user, setUser] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
    const [userData, setUserData] = useState({
        nickname: "",
        password: "",
        repeatPassword: "",
        avatar: "",
    });

    useEffect(() => {
        const getUserId = async () => {
            try {
                const response = await getUser();
                setUser(response);
            } catch (error) {
                console.log(error);
            }
        };
        getUserId();
    }, [renderKey]);

    const handleNicknameChange = (e) => {
        e.preventDefault();
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handlePasswordChange = (e, type) => {
        if (type === "password") {
            setUserData({ ...userData, password: e.target.value });
        } else {
            setUserData({ ...userData, repeatPassword: e.target.value });
        }
    };

    const handleClickChangeNickname = async (e) => {
        e.preventDefault();
        await changeNickname(user.id, userData.nickname);
        setUserData({ ...userData, nickname: "" });
        setRenderKey((prev) => prev + 1);
    };

    const handleClickChangePassword = async (e) => {
        // tuy
        e.preventDefault();
        const response = await changePassword(
            user.id,
            userData.password,
            userData.repeatPassword
        );
        if (response) {
            logout();
            navigate("/login");
        } else {
            console.log("error");
        }
    };

    const handleClickClearAvatar = (e) => {
        e.preventDefault();
        document.getElementById("avatar-input").value = "";
        setUserData({ ...userData, avatar: "" });
    };

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        setUserData({ ...userData, avatar: e.target.files[0] });
        console.log(e.target.files[0]);
    };

    const handleClickChangeAvatar = async (e) => {
        const formData = new FormData();
        formData.append("avatar", userData.avatar);

        await changeAvatar(user.id, userData.avatar);
    };
    console.log(user);
    return (
        <main>
            <div className={styles.settingsDiv}>
                {user && (
                    <div className={styles.userInfoForm}>
                        <>
                            <h3>User Info</h3>
                            <div>
                                <p>
                                    <span className={styles.label}>
                                        First name:{" "}
                                    </span>
                                    <span>{user.first_name}</span>
                                </p>
                                <p>
                                    <span className={styles.label}>
                                        Nickname:{" "}
                                    </span>
                                    <span>{user.name}</span>
                                </p>
                                <p>
                                    <span className={styles.label}>
                                        Created at:{" "}
                                    </span>
                                    <span>
                                        {user.created_at.substring(0, 10)}
                                    </span>
                                </p>
                                <p>
                                    <img src={user.avatar} alt="avatar" />
                                </p>
                            </div>
                        </>
                    </div>
                )}
                <form>
                    <input
                        type="text"
                        onChange={(e) => handleNicknameChange(e)}
                        value={userData.nickname}
                        placeholder="New nickname"
                    />
                    <button onClick={(e) => handleClickChangeNickname(e)}>
                        Change nickname
                    </button>
                    <input
                        type="password"
                        onChange={(e) => handlePasswordChange(e, "password")}
                        value={userData.password}
                        placeholder="New password"
                    />
                    <input
                        type="password"
                        onChange={(e) => handlePasswordChange(e, "repeat")}
                        value={userData.repeatPassword}
                        placeholder="Repeat new password"
                    ></input>
                    <button onClick={(e) => handleClickChangePassword(e)}>
                        Change password
                    </button>
                    <div className={styles.avatarSettings}>
                        <input
                            type="file"
                            onChange={(e) => handleChangeAvatar(e)}
                            id="avatar-input"
                            className={styles.avatarInput}
                        />
                        {userData.avatar && (
                            <div>
                                <p>Selected Avatar:</p>
                                <img
                                    src={URL.createObjectURL(userData.avatar)}
                                    alt="Selected Avatar"
                                    className={styles.selectedAvatar}
                                />
                                <button
                                    onClick={handleClickClearAvatar}
                                    className={styles.clearAvatarButton}
                                >
                                    Clear Avatar
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={(e) => handleClickChangeAvatar(e)}
                        className={styles.avatarButton}
                    >
                        Change avatar
                    </button>
                </form>
            </div>
        </main>
    );
}
