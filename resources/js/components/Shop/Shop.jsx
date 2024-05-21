import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import useUser from "../useUser";
export default function Shop() {
    const [userData, setUserData] = useState({});
    const { http } = authUser();
    const { getUser } = useUser();
    const [borders, setBorders] = useState([]);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setUserData(await getUser());
    };

    const fetchBorders = async () => {
        const response = await http.get("/api/shop/show");
        console.log(response.data);
        const responseData = response.data.toSorted(
            (a, b) => b.rarity - a.rarity
        );
        setBorders(responseData);
    };

    const handleClickBuy = async (borderId) => {
        console.log(borders[borderId]);
        console.log(userData);
        const response = await http.post(
            `/web/payment/create/border?itemId=${borderId}&firstname=${userData.firstname}&lastname=Maro&email=kon@wp.pl&phone=123456789`
        );
    };

    useEffect(() => {
        fetchBorders();
    }, []);

    return (
        <ul>
            {borders.map((border) => {
                return (
                    <li key={`shop-${border.id}`}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src={border.type}
                        ></img>
                        {border.price}
                        <button onClick={(e) => handleClickBuy(border.id)}>
                            Buy
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
