import { React } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import Comment from "../Comment/Comment";
import styles from "./comments.module.css";
import _ from "lodash";
export default function Comments({ reference_code, mainRef }) {
    console.log(mainRef);
    const [renderKey, setRenderKey] = useState(0);
    const [commentsObj, setCommentsObj] = useState({});
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const [mainCommentContent, setMainCommentContent] = useState();
    const [offset, setOffset] = useState(0);
    const { fetchComments, sendComment } = useComments();
    const { isLogged } = authUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchComments(reference_code, offset).then((data) => {
            setCommentsObj(data);
        });
    }, [reference_code, renderKey]);

    useEffect(() => {
        const handleScroll = _.throttle((event) => {
            const target = event.target;
            const scrollPercentage =
                (target.scrollTop /
                    (target.scrollHeight - target.clientHeight)) *
                100;

            if (scrollPercentage > 85 && !hasScrolledPast85) {
                const tempNumber = 1;

                console.log("Scrollbar 80% event");
            } else if (scrollPercentage < 85) {
                setHasScrolledPast85(false);
            }
            // here here here here here
        }, 1500);
        mainRef.current.addEventListener("scroll", handleScroll);
    }, [mainRef]);

    const handleTextareaChange = (e) => {
        setMainCommentContent(e.target.innerText);
    };

    const handleClickComment = async (e) => {
        if (!isLogged()) {
            navigate("/login");
            return;
        }

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
                    onInput={(e) => handleTextareaChange(e)}
                    data-text="Write comment..."
                ></div>
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
