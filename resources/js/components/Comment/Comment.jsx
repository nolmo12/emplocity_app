import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import useUser from "../useUser";
import styles from "../Comments/comments.module.css";

export default function Comment({
    comment,
    setRenderKey,
    reference_code,
    isReply,
    adminFlag,
}) {
    const { getUser, removeComment } = useUser();
    const { isLogged } = authUser();
    const navigate = useNavigate();
    const { deleteComment, sendReplyComment, editComment } = useComments();
    const [replyFlag, setReplyFlag] = useState(false);
    const [viewFlag, setViewFlag] = useState(false);
    const [editUserFlag, setEditUserFlag] = useState(false);
    const [deleteUserFlag, setDeleteUserFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [replyCommentContent, setReplyCommentContent] = useState();

    useEffect(() => {
        setReplyCommentContent("");
        const setVisibility = async () => {
            const user = await getUser();
            if (user) {
                if (user.id === comment.user_id) {
                    setEditUserFlag(true);
                    setDeleteUserFlag(true);
                }
            }
        };
        setVisibility();
    }, [comment.user_id]);

    const handleClickDelete = async (e) => {
        await deleteComment(comment.id);
        console.log("delete comment");
        setRenderKey((prev) => prev + 1);
    };

    const handleTextareaChange = (e) => {
        setReplyCommentContent(e.target.textContent);
    };

    const handleClickReply = async (e) => {
        setReplyFlag(!replyFlag);
    };

    const handleClickReplyComment = async (e, id) => {
        if (!isLogged()) {
            navigate("/login");
            return;
        }
        setReplyCommentContent("");
        await sendReplyComment(reference_code, replyCommentContent, id);

        setReplyFlag(!replyFlag);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickView = async (e) => {
        setViewFlag(!viewFlag);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickEdit = async (e) => {
        setIsEditable(!isEditable);
        if (!isEditable) {
            setReplyCommentContent(comment.content);
        }
    };

    const handleBlur = async () => {
        if (isEditable) {
            await editComment(comment.id, replyCommentContent);
            setIsEditable(false);
        }
    };

    return (
        <>
            <div className={isReply ? styles.replyContainer : ""}>
                <img src="avatar" alt="avatar" />
                <p>{comment.user_name}</p>
                <p>{comment.created_at.substring(0, 10)}</p>
                <div
                    className={styles.commentTextarea}
                    contentEditable={isEditable}
                    onInput={handleTextareaChange}
                    onBlur={handleBlur}
                    suppressContentEditableWarning={true}
                >
                    {comment.content}
                </div>
                {editUserFlag && (
                    <button
                        onClick={handleClickEdit}
                        className={isEditable ? styles.isClick : ""}
                    >
                        {isEditable ? "save" : "edit"}
                    </button>
                )}
                {deleteUserFlag && (
                    <button onClick={handleClickDelete}>delete</button>
                )}
                {comment.children_count > 0 && (
                    <button
                        onClick={handleClickView}
                        className={viewFlag ? styles.isClick : ""}
                    >
                        view {comment.children_count}
                    </button>
                )}

                {viewFlag &&
                    comment.children.map((child) => {
                        return (
                            <Comment
                                key={child.id}
                                comment={child}
                                setRenderKey={setRenderKey}
                                reference_code={reference_code}
                                isReply={true}
                            />
                        );
                    })}
                {!isReply && (
                    <button
                        onClick={handleClickReply}
                        className={replyFlag ? styles.isClick : ""}
                    >
                        reply
                    </button>
                )}
                {adminFlag && (
                    <button
                        onClick={(e) => removeComment(setRenderKey, comment.id)}
                    >
                        Remove comment
                    </button>
                )}
                {isLogged() && (
                    <Link to={`/report/comment/${comment.user_id}`}>
                        <button>Report comment</button>
                    </Link>
                )}
                {replyFlag && (
                    <>
                        <div
                            className={styles.commentTextarea}
                            contentEditable="true"
                            onInput={handleTextareaChange}
                            data-text="Write comment..."
                        ></div>
                        <button
                            onClick={(e) =>
                                handleClickReplyComment(e, comment.id)
                            }
                        >
                            comment
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
