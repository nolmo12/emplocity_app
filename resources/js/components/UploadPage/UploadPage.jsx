import React from "react";
import { useState, useEffect } from "react"
import fetchImage from "../fetchImgFromStorage";

export default function UploadPage(){
    const [uploadIconPath, setUploadIconPath] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try{
                const uploadIconPath = await fetchImage("upload.png");
                setUploadIconPath(uploadIconPath);
            }catch (error) {
                console.error(error);
            }
        }
        fetchData()

    }, [])
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleDroppedFile(files);
    }

    const handleDroppedFile = (files) => {
        console.log(files)
    }

    const handleSubmit = (e) => {
        const file = e.target
        console.log(file)
    }
    return (
        <main>
            <form onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={handleDrop}>
                {uploadIconPath && <img src={uploadIconPath} alt="uploadFileIcon"></img>}
            </form>
            <form>
                <input type="file"></input>
                <button>Subbmit</button>
            </form>
        </main>
    )
}