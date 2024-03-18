import React from "react";
import authUser from "../authUser";

export default function Settings() {
    const { logout } = authUser();
    return (
        <div>
            <h1>Settings</h1>
            <ul>
                <li>
                    <img src="img"></img>Account settings
                </li>
                <li>
                    <img src="img"></img>Upload
                </li>
                <li>
                    <img src="img"></img>History
                </li>
                <li>
                    <img src="img"></img>Liked videos
                </li>
                <li>
                    <img src="img"></img>Shop
                </li>
                <li>
                    <img src="img"></img>Help
                </li>
                <li onClick={logout}>
                    <img src="img"></img>Logout
                </li>
            </ul>
        </div>
    );
}
