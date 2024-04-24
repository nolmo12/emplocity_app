import React from "react";
import { useState } from "react";
import useComments from "../useComments";
import styles from "../Comments/comments.module.css";

export default function Comment({
    comment,
    setRenderKey,
    reference_code,
    isReply,
}) {
    const { deleteComment, sendReplyComment, fetchChildren, editComment } =
        useComments();
    const [replyFlag, setReplyFlag] = useState(false);
    const [viewFlag, setViewFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [replyCommentContent, setReplyCommentContent] = useState();
    const [replyComment, setReplyComment] = useState({});
    const [isReplyStyle, setIsReplyStyle] = useState(isReply); // Nowa zmienna stanu

    const handleClickDelete = async (e) => {
        await deleteComment(comment.id);
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
                            key={index}
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
                <textarea
                    readOnly={!isEditable}
                    defaultValue={comment.content}
                    onChange={(e) => handleTextareaChange(e)}
                />
                <button
                    onClick={(e) => handleClickEdit(e)}
                    className={isEditable ? styles.isClick : ""}
                >
                    edit
                </button>
                <button onClick={(e) => handleClickDelete(e)}>delete</button>
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
                            onClick={(e) => handleClickReplyComment(e, comment.id)}
                        >
                            comment
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
