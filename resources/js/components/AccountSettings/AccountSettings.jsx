import React from "react";
import { useState, useEffect, useRef } from "react";
import authUser from "../authUser";
import useUser from "../useUser";
import useUserSettings from "../useUserSettings";
import styles from "./accountSettings.module.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import useBorders from "../useBorders";
export default function AccountSettings() {
    const [user, setUser] = useState(null);
    const [userBorders, setUserBorders] = useState([]);
    const [imageLoaded, setImageLoaded] = useState();
    const [renderKey, setRenderKey] = useState(0);
    const [currentBorder, setCurrentBorder] = useState([]);
    const [userData, setUserData] = useState({
        nickname: "",
        previousPassword: "",
        password: "",
        repeatPassword: "",
        avatar: "",
    });
    const [validationPasswordData, setValidationPasswordData] = useState(false);
    const [validationNicknameData, setValidationNicknameData] = useState(false);
    const { getBorders, getCurrentBorder, handleClickBorder } = useBorders();
    const [removeFlag, setRemoveFlag] = useState(false);
    const { logout, getUser } = authUser();
    const { removeUser } = useUser();
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { changeNickname, changePassword, changeAvatar } = useUserSettings();

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
    }, []);

    useEffect(() => {
        getUserBorders();
    }, []);

    useEffect(() => {
        if (user && user.id) {
            getCurrentUserBorder();
        }
    }, [user]);
    // user is not a dependency of this useEffect

    const getUserBorders = async () => {
        const response = await getBorders();
        setUserBorders(response);
    };

    const getCurrentUserBorder = async () => {
        const response = await getCurrentBorder(user.id);
        setCurrentBorder(response);
        setRenderKey((prev) => prev + 1);
    };

    const handleNicknameChange = (e) => {
        e.preventDefault();
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handlePasswordChange = (e, type) => {
        if (type === "password") {
            setUserData({ ...userData, password: e.target.value });
        } else if (type === "previous") {
            setUserData({ ...userData, previousPassword: e.target.value });
        } else {
            setUserData({ ...userData, repeatPassword: e.target.value });
        }
    };
    const handleClickChangeNickname = async (e) => {
        e.preventDefault();
        const response = await changeNickname(user.id, userData.nickname);
        if (response) {
            setValidationNicknameData(response);
            const updatedUser = await getUser();
            setUser((prevUser) => ({ ...prevUser, name: updatedUser.name }));
        } else {
            setValidationNicknameData(false);
        }
        setUserData({ ...userData, nickname: "" });
        setValidationPasswordData(false);
    };

    const handleClickChangePassword = async (e) => {
        e.preventDefault();
        const response = await changePassword(
            user.id,
            userData.previousPassword,
            userData.password,
            userData.repeatPassword
        );
        if (response) {
            navigate("/login");
            logout();
            setValidationPasswordData(response);
        } else {
            setValidationPasswordData(false);
            setUserData({
                ...userData,
                previousPassword: "",
                password: "",
                repeatPassword: "",
            });
        }
        setValidationNicknameData(false);
    };

    const handleClickRemoveAccount = async (e) => {
        e.preventDefault();
        setRemoveFlag(!removeFlag);
    };

    const handleClickClearAvatar = (e) => {
        e.preventDefault();
        document.getElementById("avatar-input").value = "";
        setUserData({ ...userData, avatar: "" });
    };

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        setUserData({ ...userData, avatar: e.target.files[0] });
    };

    const handleClickChangeAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar", userData.avatar);
        await changeAvatar(user.id, userData.avatar);
        setUser((prevUser) => ({
            ...prevUser,
            avatar: URL.createObjectURL(userData.avatar),
        }));
        setUserData({ ...userData, avatar: "" });
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <main>
            <div className={styles.settingsDiv}>
                {user ? (
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
                                    {user.avatar && (
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            onLoad={() => setImageLoaded(true)}
                                            className={styles.userAvatar}
                                        />
                                    )}
                                </p>
                                {userBorders &&
                                    userBorders.borders &&
                                    userBorders.borders.length > 0 && (
                                        <p className={styles.label}>
                                            User borders:{" "}
                                        </p>
                                    )}

                                {currentBorder &&
                                    currentBorder.current_border && (
                                        <img
                                            src={
                                                currentBorder.current_border
                                                    .type
                                            }
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                            alt="current border"
                                        />
                                    )}

                                <p>
                                    {userBorders &&
                                        userBorders.borders &&
                                        userBorders.borders.map((item) => {
                                            return (
                                                <img
                                                    src={item.type}
                                                    alt="border"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                    onClick={() =>
                                                        handleClickBorder(
                                                            item.id,
                                                            setRenderKey
                                                        )
                                                    }
                                                    key={`userBorder${item.id}`}
                                                />
                                            );
                                        })}
                                </p>
                                <p></p>
                            </div>
                        </>
                    </div>
                ) : (
                    <ClipLoader />
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
                    {validationNicknameData.nameValidation && (
                        <p>The Nickname field must be a string</p>
                    )}
                    <input
                        type="password"
                        onChange={(e) => handlePasswordChange(e, "previous")}
                        value={userData.previousPassword}
                        placeholder="Previous password"
                    ></input>

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
                    {validationPasswordData.passwordValidation && (
                        <p>
                            Password is incorrect or repeat password is not the
                            same as new password
                        </p>
                    )}

                    <button onClick={(e) => handleClickChangePassword(e)}>
                        Change password
                    </button>
                    <div className={styles.avatarSettings}>
                        <input
                            type="file"
                            ref={inputRef}
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
                    <button onClick={(e) => handleClickRemoveAccount(e)}>
                        Remove Account
                    </button>
                    {removeFlag && (
                        <>
                            <p>Are you sure?</p>
                            <button onClick={() => removeUser(user.id)}>
                                Yes
                            </button>
                            <button onClick={() => setRemoveFlag(!removeFlag)}>
                                No
                            </button>
                        </>
                    )}
                </form>
            </div>
        </main>
    );
}
