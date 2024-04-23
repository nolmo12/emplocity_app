import { React } from "react";
import { useState, useEffect } from "react";
import useComments from "../useComments";
import authUser from "../authUser";
import styles from "./comments.module.css";

export default function Comments({ reference_code }) {
    const [renderKey, setRenderKey] = useState(0);
    const [commentsObj, setCommentsObj] = useState([]);
    const [replyCommentsObj, setReplyCommentsObj] = useState([]);
    const {
        fetchComments,
        sendComment,
        sendReplyComment,
        fetchChildren,
        editComment,
        deleteComment,
    } = useComments();
    const [commentContent, setCommentContent] = useState("");
    const [replyCommentContent, setReplyCommentContent] = useState("");
    const [replayArr, setReplayArr] = useState([]);
    const [replyViewFlag, setReplyViewFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [userData, setUserData] = useState({});
    const [nextCursor, setNextCursor] = useState(null);

    const { getUser } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComments(reference_code, 0);
            const response = await getUser();
            setUserData(response);
            setCommentsObj(data);
        };

        fetchData();
    }, [reference_code, renderKey]);

    const handleTextareaChange = (e, type) => {
        console.log(e.target.value);
        if (type === "reply") setReplyCommentContent(e.target.value);
        if (type === "comment") setCommentContent(e.target.value);
    };

    const handleClickButton = async (e) => {
        try {
            await sendComment(reference_code, commentContent);
            setRenderKey((prev) => prev + 1);
            // setCommentsObj([...commentsObj, { comment: commentContent }]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickReplyComment = async (e, parentId) => {
        e.preventDefault();
        try {
            await sendReplyComment(
                reference_code,
                replyCommentContent,
                parentId
            );
            setRenderKey((prev) => prev + 1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickReply = (e, id) => {
        e.preventDefault();
        if (replayArr.includes(id)) {
            const index = replayArr.indexOf(id);
            replayArr.splice(index, 1);
            setReplayArr([...replayArr]);
            return;
        }
        setReplayArr([...replayArr, id]);
    };

    const handleClickView = async (e, parentId) => {
        console.log(parentId);
        const data = await fetchChildren(parentId);
        setRenderKey((prev) => prev + 1);
        console.log(data);
        setReplyCommentsObj(data);
        setReplyViewFlag(!replyViewFlag);
    };

    const handleClickEdit = async (e, type, commentId, userId) => {
        if (userData.id === userId) {
            setIsEditable(!isEditable);
            if (isEditable === true && type === "comment")
                await editComment(commentId, commentContent);
            if (isEditable === true && type === "reply")
                await editComment(commentId, replyCommentContent);
            setRenderKey((prev) => prev + 1);
        }
    };

    const handleClickDelete = async (e, id, userId) => {
        if (userData.id === userId) {
            try {
                await deleteComment(id);
                setRenderKey((prev) => prev + 1);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const view =
        commentsObj.length < 1 ? (
            <div className={styles.commentTextarea}>
                <p>No comments yet</p>
                <textarea
                    onChange={(e) => handleTextareaChange(e, "comment")}
                ></textarea>
                <button onClick={(e) => handleClickButton(e)}>Comment</button>
            </div>
        ) : (
            <>
                <textarea
                    onChange={(e) => handleTextareaChange(e, "comment")}
                ></textarea>
                <button onClick={(e) => handleClickButton(e)}>Comment</button>
                {Object.entries(commentsObj).map(([key, commentObj]) => {
                    return commentObj.map((comment) => {
                        const temp = replayArr.includes(comment.id);
                        return (
                            <div key={comment.id}>
                                <div className={styles.mainCommentDiv}>
                                    <img src="dsa" alt="avatar"></img>
                                    <p>{comment.user_name}</p>
                                    <p>{comment.created_at}</p>
                                    <textarea
                                        readOnly={!isEditable}
                                        onChange={(e) =>
                                            handleTextareaChange(e, "comment")
                                        }
                                    >
                                        {comment.content}
                                    </textarea>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleClickEdit(
                                            e,
                                            "comment",
                                            comment.id,
                                            comment.user_id
                                        )
                                    }
                                >
                                    edit
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleClickDelete(
                                            e,
                                            comment.id,
                                            comment.user_id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                                <>
                                    {comment.has_children && (
                                        <button
                                            onClick={(e) =>
                                                handleClickView(e, comment.id)
                                            }
                                        >
                                            view
                                        </button>
                                    )}

                                    {replyViewFlag &&
                                        Object.entries(replyCommentsObj).map(
                                            ([key, replyCommentObj]) => {
                                                return replyCommentObj.map(
                                                    (replyComment) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    replyComment.id
                                                                }
                                                                className={styles.replyCommentDiv}
                                                            >
                                                                <img
                                                                    src="dsa"
                                                                    alt="avatar"
                                                                ></img>
                                                                <p>
                                                                    {
                                                                        replyComment.user_name
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {
                                                                        replyComment.created_at
                                                                    }
                                                                </p>
                                                                <textarea
                                                                    readOnly={
                                                                        !isEditable
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleTextareaChange(
                                                                            e,
                                                                            "reply",
                                                                            replyComment.id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        replyComment.content
                                                                    }
                                                                </textarea>
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickEdit(
                                                                            e,
                                                                            "reply",
                                                                            replyComment.id,
                                                                            replyComment.user_id
                                                                        )
                                                                    }
                                                                >
                                                                    edit
                                                                </button>
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleClickDelete(
                                                                            e,
                                                                            replyComment.id,
                                                                            replyComment.user_id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                );
                                            }
                                        )}
                                    <button
                                        onClick={(e) =>
                                            handleClickReply(e, comment.id)
                                        }
                                    >
                                        reply
                                    </button>

                                    {temp && (
                                        <>
                                            <textarea
                                                onChange={(e) =>
                                                    handleTextareaChange(
                                                        e,
                                                        "reply"
                                                    )
                                                }
                                            ></textarea>
                                            <button
                                                onClick={(e) =>
                                                    handleClickReplyComment(
                                                        e,
                                                        comment.id
                                                    )
                                                }
                                            >
                                                Comment
                                            </button>
                                        </>
                                    )}
                                </>
                            </div>
                        );
                    });
                })}
            </>
        );

    return <div className={styles.commentDiv}>{view}</div>;
}
