import React from "react";
import loop from "./loop.png";
export default function SearchBar() {
    return (
        <div>
            <input type="text"></input>
            <img src={loop} alt="SearchLoop"></img>
        </div>
    );
}
