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
        console.log("render");

        fetchComments(reference_code, 0).then((data) => {
            setCommentsObj(data);
        });
    }, [reference_code, renderKey]);
    const handleTextareaChange = (e, type) => {
        console.log(e.target.value);
        setMainCommentContent(e.target.innerText);
    };
    const handleClickComment = async (e) => {
        await sendComment(reference_code, mainCommentContent);
        e.target.previousElementSibling.innerText = "";
        setRenderKey((prev) => prev + 1);
    };

    return (
        <div className={styles.commentDiv}>
            <div>
                <div
                    className={styles.commentTextarea}
                    contentEditable="true"
                    onInput={(e) => handleTextareaChange(e, "comment")}
                ></div>
                <button onClick={(e) => handleClickComment(e)}>Comment</button>
            </div>
            {commentsObj.comments &&
                Object.entries(commentsObj).map(([key, commentObj]) => {
                    console.log(commentObj);
                    return commentObj.map((comment, index) => {
                        console.log(comment);
                        return (
                            <div
                                className={styles.commentContainer}
                                key={index}
                            >
                                {console.log(comment)}
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
