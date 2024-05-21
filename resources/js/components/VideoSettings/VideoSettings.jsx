import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import useVideoSettings from "../useVideoSettings";
import { useParams, useNavigate } from "react-router-dom";
export default function VideoSettings() {
    const [data, setData] = useState({
        title: "",
        description: "",
        tags: "",
        thumbnail: "",
        visibility: "Public",
    });
    const [videoObj, setVideoObj] = useState({});
    const [loaded, setIsLoaded] = useState(false);
    const { http, isLogged } = authUser();
    const { reference_code } = useParams();
    const { sendData } = useVideoSettings();

    useEffect(() => {
        getVideo();
    }, []);

    const handleClickRemove = async () => {
        await http.delete(`/api/video/delete`, {
            params: { reference_code: reference_code },
        });
    };

    const getVideo = async () => {
        const response = await http.get(`/api/video/watch/${reference_code}`);
        setVideoObj(response.data);
        setIsLoaded(true);
    };

    const handleChangeTitle = (e) => {
        setData({ ...data, title: e.target.value });
    };

    const handleChangeDescription = async (e) => {
        setData({ ...data, description: e.target.value });
    };

    const handleChangeVisibility = (e) => {
        setData({ ...data, visibility: e.target.value });
    };

    const handleChangeTags = (e) => {
        const arr = e.target.value.split(" ");
        setData((prev) => ({ ...prev, tags: arr }));
    };

    const handleChangeThumbnail = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("thumbnail", file);
        setData({ ...data, thumbnail: formData });
    };

    return (
        <main>
            {loaded && (
                <form>
                    <input
                        type="text"
                        onChange={(e) => handleChangeTitle(e)}
                        defaultValue={videoObj.title}
                    ></input>
                    <button
                        onClick={(e) =>
                            sendData("title", reference_code, data.title, e)
                        }
                    >
                        Change title
                    </button>
                    <input
                        type="text"
                        onChange={(e) => handleChangeDescription(e)}
                        defaultValue={videoObj.description}
                    ></input>
                    <button
                        onClick={(e) =>
                            sendData(
                                "description",
                                reference_code,
                                data.description,
                                e
                            )
                        }
                    >
                        Change description
                    </button>
                    <input
                        type="text"
                        onChange={(e) => handleChangeTags(e)}
                        defaultValue={videoObj.tags.map((tag) => {
                            return `#${tag.name}`;
                        })}
                    ></input>
                    <button
                        onClick={(e) =>
                            sendData("tags", reference_code, data.tags, e)
                        }
                    >
                        Change tags
                    </button>
                    <select
                        defaultValue={videoObj.visibility}
                        onChange={(e) => handleChangeVisibility(e)}
                    >
                        <option value="Public">Public</option>
                        <option value="Unlisted">Unlisted</option>
                        {isLogged() && <option value="Hidden">Hidden</option>}
                    </select>
                    <button
                        onClick={(e) =>
                            sendData(
                                "visibility",
                                reference_code,
                                data.visibility,
                                e
                            )
                        }
                    >
                        Change Visibility
                    </button>
                    <input
                        type="file"
                        onChange={(e) => handleChangeThumbnail(e)}
                    ></input>
                    <button
                        onClick={(e) =>
                            sendData(
                                "thumbnail",
                                reference_code,
                                data.thumbnail,
                                e
                            )
                        }
                    >
                        Change thumbnail
                    </button>
                    <button onClick={() => handleClickRemove()}>
                        Remove video
                    </button>
                </form>
            )}
        </main>
    );
}
