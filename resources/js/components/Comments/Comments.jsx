import { React } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import Comment from "../Comment/Comment";
import styles from "./comments.module.css";
import _ from "lodash";

export default function Comments({ reference_code, mainRef, adminFlag }) {
    const [isTextareaClicked, setIsTextareaClicked] = useState(false);
    const commentTextareaRef = useRef(null);
    const [renderKey, setRenderKey] = useState(0);
    const [mainCommentContent, setMainCommentContent] = useState();
    const previousScroll = useRef(0);
    const offset = useRef(0);
    const {
        fetchVideosSets,
        sendComment,
        commentsObj,
        setCommentsObj,
    } = useComments();
    const { isLogged } = authUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (offset.current === 0) {
            getCommentsObj();
        }
    }, [renderKey]);

    useEffect(() => {
        setCommentsObj({ comments: [] });
        offset.current = 0;
        getCommentsObj();
    }, [reference_code]);

    useEffect(() => {
        const scrollElement = mainRef.current;

        const handleScroll = _.throttle((event) => {
            const target = event.target;
            const currentScroll = target.scrollTop;
            const scrollPercentage =
                (target.scrollTop /
                    (target.scrollHeight - target.clientHeight)) *
                100;

            if (previousScroll.current < currentScroll) {
                if (
                    scrollPercentage > 85 &&
                    commentsObj?.comments?.length > 9
                ) {
                    getCommentsObj();
                }
            }
            previousScroll.current = currentScroll;
        }, 1000);

        if (scrollElement) {
            scrollElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [commentsObj, mainRef]);

    const getCommentsObj = async () => {
        console.log(reference_code);
        const response = await fetchVideosSets(reference_code, offset.current);
        if (response.data.comments.length > 0) {
            console.log(response.data);
            offset.current += 1;
        }
    };

    const handleTextareaChange = (e) => {
        setMainCommentContent(e.target.innerText);
    };

    const handleTextareaClick = () => {
        setIsTextareaClicked(true);
    };

    const handleCancelComment = () => {
        setIsTextareaClicked(false);
        setMainCommentContent('');
        if (commentTextareaRef.current) {
            commentTextareaRef.current.textContent = '';
        }
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
            <div className={styles.commentTextareaContainer}>
                <div
                    ref={commentTextareaRef}
                    className={styles.commentTextarea}
                    contentEditable="true"
                    onInput={(e) => handleTextareaChange(e)}
                    onClick={handleTextareaClick}
                    data-text="Write comment..."
                ></div>
                {isTextareaClicked && (
                    <div>
                        <button onClick={(e) => handleClickComment(e)}>Comment</button>
                        <button onClick={(e) => handleCancelComment(e)} className={styles.cancelButton}>Cancel</button>
                    </div>
                )}
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
