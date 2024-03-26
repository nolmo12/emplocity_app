import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import fetchImage from "../fetchImgFromStorage";
import styles from "./searchBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
        
    const [loopPath, setLoopPath] = useState("");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loopPath = await fetchImage("loop.png");
                setLoopPath(loopPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    function handleChange(e) {
        setQuery(e.target.value);
    }

    function handleKeyDown(e){
        if(e.key === "Enter"){
            navigate("/search-result");
        }
    }

    const handleClick= () => {
        navigate("/search-result");
    };

    return (
        
        <div id={styles.searchBarLoop}>
            <input
                    type="text"
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    id={styles.searchBar}
                ></input>
            <FontAwesomeIcon icon={faSearch} id={styles.searchLoop}/>
            
            </div>
                

        
    );
}
