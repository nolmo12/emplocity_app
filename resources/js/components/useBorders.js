import { useState } from "react";
import authUser from "./authUser";
export default function useBorders() {
    const { http } = authUser();
    const getBorders = async () => {
        const response = await http.get(`/api/auth/borders`);
console.log("user borders: ", response.data);
        return response.data;
    };

    const getCurrentBorder = async (userId) => {
        const response = await http.get(`/api/auth/currentBorder/${userId}`);
        return response.data;
    };

    const handleClickBorder = async (borderId, setRenderKey) => {
        const response = await http.patch(
            `/api/auth/changeCurrentBorder`, {
            borderId: borderId,                 
}
        );
if(response) setRenderKey((prev) => prev + 1);
console.log("user clicl border: ", response.data)
    };
    return { getBorders, getCurrentBorder, handleClickBorder };
}
