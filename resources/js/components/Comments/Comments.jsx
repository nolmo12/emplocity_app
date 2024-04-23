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
    const [replyArr, setReplyArr] = useState([]);
    const [viewReplyArr, setViewReplyArr] = useState([]);
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

    const handleClickComment = async (e) => {
        await sendComment(reference_code, commentContent);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickReplyComment = async (e, parentId) => {
        e.preventDefault();
        await sendReplyComment(reference_code, replyCommentContent, parentId);
        handleClickReply(e, parentId); // close reply textarea
        setRenderKey((prev) => prev + 1);
    };

    const handleClickReply = (e, id) => {
        if (replyArr.includes(id)) {
            const index = replyArr.indexOf(id);
            replyArr.splice(index, 1);
            setReplyArr([...replyArr]);
            return;
        }
        setReplyArr([...replyArr, id]);
    };

    const handleClickView = async (e, parentId) => {
        if (viewReplyArr.includes(parentId)) {
            const index = viewReplyArr.indexOf(parentId);
            viewReplyArr.splice(index, 1);
            setViewReplyArr([...viewReplyArr]);
            return;
        }
        setViewReplyArr([...viewReplyArr, parentId]);
        const data = await fetchChildren(parentId);
        setRenderKey((prev) => prev + 1);
        setReplyCommentsObj(data);
    };

    const handleClickEdit = async (e, type, commentId, userId) => {
        if (userData.id === userId) {
            setIsEditable(!isEditable);
            let copy;
            if (isEditable === true && type === "comment")
                await editComment(commentId, commentContent);
            copy = { ...commentsObj };
            Object.entries(copy).map(([key, commentObj]) => {
                return commentObj.map((comment) => {
                    if (comment.id === commentId) {
                        comment.content = commentContent;
                    }
                });
            });
            if (isEditable === true && type === "reply")
                await editComment(commentId, replyCommentContent);
            copy = { ...replyCommentsObj };
            Object.entries(copy).map(([key, replyCommentObj]) => {
                return replyCommentObj.map((replyComment) => {
                    if (replyComment.id === commentId) {
                        replyComment.content = replyCommentContent;
                    }
                });
            });
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
                <button onClick={(e) => handleClickComment(e)}>Comment</button>
            </div>
        ) : (
            <>
                <textarea
                    onChange={(e) => handleTextareaChange(e, "comment")}
                ></textarea>
                <button onClick={(e) => handleClickComment(e)}>Comment</button>
                {Object.entries(commentsObj).map(([key, commentObj]) => {
                    return commentObj.map((comment) => {
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

                                    {viewReplyArr.includes(comment.id) &&
                                        Object.entries(replyCommentsObj).map(
                                            ([key, replyCommentObj]) => {
                                                return replyCommentObj.map(
                                                    (replyComment) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    replyComment.id
                                                                }
                                                                className={
                                                                    styles.replyCommentDiv
                                                                }
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

                                    {replyArr.includes(comment.id) && (
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
