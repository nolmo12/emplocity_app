import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";

export default function AccountSettings() {
    const [user, setUser] = useState();
    const [userData, setUserData] = useState({
        first_name: "",
        nickname: "",
    });
    const { http, getUser } = authUser();

    useEffect(() => {
        getUser().then((data) => {
            setUser(data);
        });
    }, []);

    const handleChangeFirstName = (e) => {
        setUserData({ ...userData, first_name: e.target.value });
    };

    const handleChangeNickname = (e) => {
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(userData);
            // api call
        } catch (error) {
            console.log(error);
        }
    };

    console.log(user);
    return (
        <main>
            <div>
                {user && (
                    <>
                        <h3>User Info</h3>
                        <p>First name {user.first_name}</p>
                        <p>Nickname {user.name}</p>
                        <p>Premium border {user.border_id ? "yes" : "no"}</p>
                        <img src="Fd" alt="Avatar" />
                    </>
                )}
            </div>
            <div>
                {user && (
                    <>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <p>Change first name</p>
                            <input
                                type="text"
                                onChange={(e) => handleChangeFirstName(e)}
                            />
                            <p>Nickname</p>
                            <input
                                type="text"
                                onChange={(e) => handleChangeNickname(e)}
                            />
                            <button>Save</button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}
