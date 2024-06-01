import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./searchBar.module.css";

const tempData = [
    "The Legend of Zelda",
    "Super Mario Bros.",
    "aaaa",
    "aaaaaaaa",
    "aaaaa",
    "Minecraft",
    "Fortnite",
    "Call of Duty",
    "World of Warcraft",
    "Overwatch",
    "Grand Theft Auto V",
    "The Witcher 3",
    "Red Dead Redemption 2",
    "Halo",
    "Pokemon",
    "League of Legends",
    "Dota 2",
    "Counter-Strike",
    "Apex Legends",
    "Valorant",
    "Among Us",
    "Animal Crossing",
    "Dark Souls",
    "Cyberpunk 2077",
    "Assassin's Creed",
    "Tetris",
    "The Sims",
    "Battlefield",
    "FIFA",
    "Madden NFL",
    "NBA 2K",
    "Street Fighter",
    "Mortal Kombat",
    "Fallout",
    "The Elder Scrolls",
    "Far Cry",
    "BioShock",
    "StarCraft",
    "Diablo",
    "Hearthstone",
    "Rainbow Six Siege",
    "PUBG",
    "Horizon Zero Dawn",
];

export default function SearchBar() {
    const [data, setData] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setData(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            if (data) search();
        }
    }

    const handleClick = () => {
        if (data) search();
    };

    const search = (item = data) => {
        setData("");
        navigate(`/search-result/${item}/popularity`);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBarLoop}>
                <input
                    type="text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={styles.searchBar}
                    placeholder="Search"
                    value={data}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    onClick={handleClick}
                    className={styles.searchLoop}
                />
            </div>
            <ul className={styles.ulItem}>
                {tempData
                    .filter((item) => {
                        const searchItem = data.toLowerCase();
                        const tempItem = item.toLowerCase();
                        return searchItem && tempItem.startsWith(searchItem);
                    })
                    .map((item, index) => (
                        <li
                            key={index}
                            className={styles.searchItem}
                            onClick={() => {
                                setData(item);
                                search(item);
                            }}
                        >
                            {item}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
