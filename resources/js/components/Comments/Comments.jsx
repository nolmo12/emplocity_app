import { React } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import Comment from "../Comment/Comment";
import styles from "./comments.module.css";
import _ from "lodash";

export default function Comments({
    reference_code,
    mainRef,
    adminFlag,
    renderKeyFromParent,
}) {
    const [renderKey, setRenderKey] = useState(0);
    // const [commentsObj, setCommentsObj] = useState({});
    const [hasScrolledPast85, setHasScrolledPast85] = useState(false);
    const [mainCommentContent, setMainCommentContent] = useState();
    const offset = useRef(0);
    const {
        fetchComments,
        fetchNextComments,
        sendComment,
        commentsObjFrom,
        setCommentsObjFrom,
    } = useComments();
    const { isLogged } = authUser();
    const navigate = useNavigate();

    const handleScroll = _.throttle((event) => {
        const target = event.target;
        const scrollPercentage =
            (target.scrollTop / (target.scrollHeight - target.clientHeight)) *
            100;

        if (scrollPercentage > 85 && !hasScrolledPast85) {
            console.log(offset.current);
            offset.current += 1;
            getCommentsObj(reference_code, offset.current);
            setHasScrolledPast85(true);
        } // musze zablokowac mozliwosc szybkiego wyslanei zeby offset nie zmienial wartosci w gore nikontrolowanie
        // else if (scrollPercentage < 85) {
        //     setHasScrolledPast85(false);
        // }
        // here here here here here
    }, 3000);

    useEffect(() => {
        if (offset.current === 0) {
            fetchComments(reference_code, offset.current).then((data) => {
                setCommentsObjFrom(data);
            });
        } else {
            console.log(offset.current);

            getCommentsObj(reference_code, 1);
        }
    }, [reference_code, renderKey]);

    // useEffect(() => {
    //     offset.current = 0;
    //     setCommentsObj({});
    //     setHasScrolledPast85(false);
    // }, [renderKeyFromParent]);

    useEffect(() => {
        mainRef.current.addEventListener("scroll", handleScroll);
    }, [mainRef]);

    const getCommentsObj = async (reference_code, offset) => {
        const response = await fetchNextComments(reference_code, offset);
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
            {commentsObjFrom &&
                commentsObjFrom.comments &&
                Object.entries(commentsObjFrom).map(([key, commentObj]) => {
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
