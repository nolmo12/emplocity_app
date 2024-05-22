import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "../authUser";
import useUser from "../useUser";
import useBorders from "../useBorders";
export default function Shop() {
    const [userData, setUserData] = useState({});
    const [userBorders, setUserBorders] = useState([]);
    const [borders, setBorders] = useState([]);
    const { getBorders } = useBorders();
    const { http } = authUser();
    const { getUser } = useUser();
    const navigate = useNavigate();

    const getUserData = async () => {
        setUserData(await getUser());
        setUserBorders(await fetchBorders());
    };

    const fetchBorders = async () => {
        try {
            const response = await http.get("/api/shop/show");
            console.log(response.data);
            const responseData = response.data.toSorted(
                (a, b) => b.rarity - a.rarity
            );
            setBorders(responseData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickBuy = async (borderId) => {
        try {
            const response = await http.get(
                `/web/payment/create/border?itemId=${borderId}&firstname=${userData.firstname}&lastname=Maro&email=kon@wp.pl&phone=48123456789`
            );
            if (response.data)   window.location.href = response.data.url;
        } catch (error) {
            console.log(error);
        }
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
