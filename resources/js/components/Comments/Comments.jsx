import { React } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import Comment from "../Comment/Comment";
import styles from "./comments.module.css";
import _ from "lodash";

export default function Comments({ reference_code, mainRef, adminFlag }) {
    const [renderKey, setRenderKey] = useState(0);
    const [commentsObj, setCommentsObj] = useState({});
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const [mainCommentContent, setMainCommentContent] = useState();
    const offset = useRef(0);
    const { fetchComments, fetchNextComments, sendComment } = useComments();
    const { isLogged } = authUser();
    const navigate = useNavigate();

    const handleScroll = _.throttle((event) => {
        const target = event.target;
        const scrollPercentage =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        if (scrollPercentage > 85 && !hasScrolledPast85) {
            offset.current = offset.current + 1;
            fetchNextComments(reference_code, offset.current).then((data) => {
                setCommentsObj((prev) => ({
                    ...prev,
                    comments: [...prev.comments, ...data.comments],
                }));
            });

            console.log("Scrollbar 80% event");
            setHasScrolledPast85(true);
        } else if (scrollPercentage < 85) {
            setHasScrolledPast85(false);
        }
        // here here here here here
    }, 1500);

    useEffect(() => {
        fetchComments(reference_code, 0).then((data) => {
            setCommentsObj(data);
        });
    }, [reference_code, renderKey]);
    console.log(commentsObj);

    useEffect(() => {
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
                                    adminFlag={adminFlag}
                                />
                            </div>
                        );
                    });
                })}
        </div>
    );
}
