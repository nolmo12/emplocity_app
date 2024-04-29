import React from "react";
import { useState, useEffect } from "react";
import useComments from "../useComments";
import authUser from "../authUser";
import styles from "../Comments/comments.module.css";

export default function Comment({
    comment,
    setRenderKey,
    reference_code,
    isReply,
}) {
    const { getUser } = authUser();
    const { deleteComment, sendReplyComment, fetchChildren, editComment } =
        useComments();
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

        setRenderKey((prev) => prev + 1);
    };

    const handleTextareaChange = (e) => {
        setReplyCommentContent(e.target.textContent);
        console.log(replyCommentContent);
    };

    const handleClickReply = async (e) => {
        setReplyFlag(!replyFlag);
    };

    const handleClickReplyComment = async (e, id) => {
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
                {replyFlag && (
                    <>
                        <div
                            className={styles.commentTextarea}
                            contentEditable="true"
                            onInput={handleTextareaChange}
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
