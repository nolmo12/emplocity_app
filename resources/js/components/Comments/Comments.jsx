import { React } from "react";
import { useState, useEffect } from "react";
import useComments from "../useComments";
import authUser from "../authUser";
import Comment from "../Comment/Comment";
import styles from "./comments.module.css";

export default function Comments({ reference_code }) {
    const [renderKey, setRenderKey] = useState(0);
    const [commentsObj, setCommentsObj] = useState({});
    const [mainCommentContent, setMainCommentContent] = useState();
    const { fetchComments, sendComment } = useComments();
    useEffect(() => {
        fetchComments(reference_code, 0).then((data) => {
            setCommentsObj(data);
        });
    }, [reference_code, renderKey]);
    const handleTextareaChange = (e, type) => {
        setMainCommentContent(e.target.value);
    };
    const handleClickComment = async (e) => {
        await sendComment(reference_code, mainCommentContent);
        e.target.previousElementSibling.value = "";
        setRenderKey((prev) => prev + 1);
    };

    return (
        <div className={styles.commentDiv}>
            <div>
                <textarea
                    onChange={(e) => handleTextareaChange(e, "comment")}
                ></textarea>
                <button onClick={(e) => handleClickComment(e)}>Comment</button>
            </div>
            {commentsObj.comments &&
                Object.entries(commentsObj).map(([key, commentObj]) => {
                    return commentObj.map((comment, index) => {
                        return (
                            <div
                                className={styles.commentContainer}
                                key={index}
                            >
                                <Comment
                                    comment={comment}
                                    setRenderKey={setRenderKey}
                                    reference_code={reference_code}
                                    isReply={false}
                                />
                            </div>
                        );
                    });
                })}
        </div>
    );
}
