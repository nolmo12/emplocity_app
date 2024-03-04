import React from "react";
import loop from "./loop.png";
import styles from "./searchBar.module.css";
export default function SearchBar() {
    return (
        <div>
            <input type="text"></input>
            <img src={loop} alt="SearchLoop"></img>
        </div>
    );
}
