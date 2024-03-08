import React from "react";
import loop from "./loop.png";
import styles from "./searchBar.module.css";
export default function SearchBar() {
    return (
        <div id={styles.searchBarLoop}>
            <input type="text" id={styles.searchBar}></input>
            <img src={loop} alt="SearchLoop" id={styles.searchLoop}></img>
        </div>
    );
}
