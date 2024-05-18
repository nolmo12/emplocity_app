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
    const [mainCommentContent, setMainCommentContent] = useState();
    const previousScroll = useRef(0);
    const offset = useRef(0);
    const {
        fetchVideosSets,
        getAllComments,
        sendComment,
        commentsObj,
        setCommentsObj,
    } = useComments();
    const { isLogged } = authUser();
    const navigate = useNavigate();

    const handleScroll = _.throttle((event) => {
        const target = event.target;
        const currentScroll = target.scrollTop;
        const scrollPercentage =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        if (previousScroll.current < currentScroll) {
            if (scrollPercentage > 85) {
                console.log("offset with api: ", offset.current);
                getCommentsObj(reference_code, offset);
                offset.current += 1;
                console.log("after: ", offset.current);
            }
        }
        previousScroll.current = currentScroll;
    }, 1000);

    useEffect(() => {
        if (offset.current === 0) {
            getCommentsObj();
        } else {
            getAllComments();
        }
    }, [renderKey]);

    useEffect(() => {
        mainRef.current.addEventListener("scroll", handleScroll);
    }, [mainRef]);

    const getCommentsObj = async () => {
        await fetchVideosSets(reference_code, offset.current);
    };

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
            {commentsObj &&
                commentsObj.comments &&
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
                                    setCommentsObj={setCommentsObj}
                                />
                            </div>
                        );
                    });
                })}
        </div>
    );
}
