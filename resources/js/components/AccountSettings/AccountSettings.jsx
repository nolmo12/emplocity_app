import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import useUserSettings from "../useUserSettings";
import styles from "./accountSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { render } from "@testing-library/react";

export default function AccountSettings() {
    const { http, isLogged, getUser } = authUser();
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
        console.log(e.target.value);
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
        setRenderKey((prev) => prev + 1);
    };

    const handleClickChangePassword = async (e) => {
        // tuy
        e.preventDefault();
        await changePassword(
            user.id,
            userData.password,
            userData.repeatPassword
        );
        console.log(2);
    };

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        setUserData({ ...userData, avatar: e.target.files[0] });
        console.log(e.target.files[0]);
    };

    const handleClickChangeAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(userData.avatar);
        formData.append("avatar", userData.avatar);
        await changeAvatar(user.id, formData);
    };
    return (
        <main>
            <div className={styles.settingsDiv}>
                {user && (
                    <div className={styles.userInfoForm}>
                        <>
                            <h3>User Info</h3>
                            <div>
                                <p>First name: {user.first_name}</p>
                                <p>Nickname: {user.name}</p>
                                <p>
                                    Created at:{" "}
                                    {user.created_at.substring(0, 10)}
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
                        placeholder="New nickname"
                    />
                    <button onClick={(e) => handleClickChangeNickname(e)}>
                        Change nickname
                    </button>
                    <input
                        type="password"
                        onChange={(e) => handlePasswordChange(e, "password")}
                        placeholder="New password"
                    />
                    <input
                        type="password"
                        onChange={(e) => handlePasswordChange(e, "repeat")}
                        placeholder="Repeat new password"
                    ></input>
                    <button onClick={(e) => handleClickChangePassword(e)}>
                        Change password
                    </button>
                    <input
                        type="file"
                        onChange={(e) => handleChangeAvatar(e)}
                    />
                    <button onClick={(e) => handleClickChangeAvatar(e)}>
                        Change avatar
                    </button>
                </form>
            </div>
        </main>
    );
}
