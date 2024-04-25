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
    replyCommentsObj,
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
    const [replyComment, setReplyComment] = useState({});
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
        if (isReply) {
            console.log("isReply");
        }
        setRenderKey((prev) => prev + 1);
    };

    const handleTextareaChange = (e) => {
        setReplyCommentContent(e.target.value);
    };

    const handleClickReply = async (e) => {
        setReplyFlag(!replyFlag);
    };

    const handleClickReplyComment = async (e, id) => {
        console.log(comment.id);
        setReplyCommentContent("");
        await sendReplyComment(reference_code, replyCommentContent, id);

        setReplyFlag(!replyFlag);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickView = async (e) => {
        const tempReplyComments = await fetchChildren(comment.id);
        setViewFlag(!viewFlag);
        const newReplyComments = Object.entries(tempReplyComments).map(
            ([key, tempReplyCommentsObj]) => {
                return tempReplyCommentsObj.map((tempReplyComment, index) => {
                    return (
                        <Comment
                            key={tempReplyComment.id}
                            comment={tempReplyComment}
                            setRenderKey={setRenderKey}
                            reference_code={reference_code}
                            isReply={true}
                        />
                    );
                });
            }
        );
        setReplyComment(newReplyComments);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickEdit = async (e) => {
        setIsEditable(!isEditable);
        if (!isEditable) {
            setReplyCommentContent(comment.content);
        }
        if (isEditable) {
            console.log(replyCommentContent);
            await editComment(comment.id, replyCommentContent);
        }
        setRenderKey((prev) => prev + 1);
    };

    return (
        <>
            <div className={isReply ? styles.replyContainer : ""}>
                <img src="avatar" alt="avatar" />
                <p>{comment.user_name}</p>
                <p>{comment.created_at}</p>
                {console.log(comment)}
                <p>{comment.content}</p>
                <textarea
                    readOnly={!isEditable}
                    onChange={(e) => handleTextareaChange(e)}
                    value={isEditable ? replyCommentContent : comment.content}
                ></textarea>
                {editUserFlag && (
                    <button
                        onClick={(e) => handleClickEdit(e)}
                        className={isEditable ? styles.isClick : ""}
                    >
                        edit
                    </button>
                )}
                {deleteUserFlag && (
                    <button onClick={(e) => handleClickDelete(e)}>
                        delete
                    </button>
                )}
                {comment.has_children && (
                    <button
                        onClick={(e) => handleClickView(e)}
                        className={viewFlag ? styles.isClick : ""}
                    >
                        view
                    </button>
                )}
                {viewFlag && replyComment}
                {!isReply && (
                    <button
                        onClick={(e) => handleClickReply(e)}
                        className={replyFlag ? styles.isClick : ""}
                    >
                        reply
                    </button>
                )}
                {replyFlag && (
                    <>
                        <textarea
                            onChange={(e) => handleTextareaChange(e)}
                        ></textarea>
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
