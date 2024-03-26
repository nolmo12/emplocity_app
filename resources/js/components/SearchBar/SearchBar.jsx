import React from "react";
import { useState, useEffect } from "react";
import fetchImage from "../fetchImgFromStorage";
import styles from "./searchBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {

    return (
        <div id={styles.searchBarLoop}>
            <input type="text" id={styles.searchBar}></input>
            <FontAwesomeIcon icon={faSearch} id={styles.searchLoop}/>
        </div>
    );
}
