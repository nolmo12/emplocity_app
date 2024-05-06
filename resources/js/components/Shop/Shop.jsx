import React from "react";
export default function Shop() {
    const handleClickBuy = async (buttonId) => {
        console.log(buttonId);
    };
    return (
        <>
            <img src="border1" alt="border1" />
            <button onClick={() => handleClickBuy(1)}>Buy</button>
            <img src="border2" alt="border2" />
            <button onClick={() => handleClickBuy(2)}>Buy</button>
            <img src="border3" alt="border3" />
            <button onClick={() => handleClickBuy(3)}>Buy</button>
        </>
    );
}
