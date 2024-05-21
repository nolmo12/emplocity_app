import React, { useState, useEffect } from "react";
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
    setCommentsObj,
}) {
    const { getUser, removeComment } = useUser();
    const { isLogged } = authUser();
    const navigate = useNavigate();
    const {
        deleteComment,
        sendReplyComment,
        fetchChildrenComments,
        editComment,
    } = useComments();
    const [replyFlag, setReplyFlag] = useState(false);
    const [viewFlag, setViewFlag] = useState(false);
    const [editUserFlag, setEditUserFlag] = useState(false);
    const [deleteUserFlag, setDeleteUserFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [replyCommentContent, setReplyCommentContent] = useState("");

    useEffect(() => {
        const setVisibility = async () => {
            const user = await getUser();
            if (user && user.id === comment.user_id) {
                setEditUserFlag(true);
                setDeleteUserFlag(true);
            }
        };
        setVisibility();
    }, [comment.user_id]);

    const handleClickDelete = async () => {
        await deleteComment(comment.id);
        setRenderKey((prev) => prev + 1);

        setCommentsObj((prev) => ({
            ...prev,
            comments: prev.comments.filter((c) => c.id !== comment.id),
        }));
    };

    const handleTextareaChange = (e) => {
        setReplyCommentContent(e.target.innerHTML);
    };

    const handleClickReply = () => {
        setReplyFlag(!replyFlag);
    };

    const handleClickReplyComment = async (e, id) => {
        if (!isLogged()) {
            navigate("/login");
            return;
        }
        setReplyCommentContent(""); //////
        const newReply = await sendReplyComment(
            //////
            reference_code, /////
            replyCommentContent, /////
            id /////
        );

        setCommentsObj((prev) => {
            const updatedComments = prev.comments.map((c) => {
                if (c.id === id) {
                    return {
                        ...c,
                        children: [...c.children, newReply],
                        children_count: c.children_count + 1,
                    };
                }
                return c;
            });
            return { ...prev, comments: updatedComments };
        });

        setReplyFlag(!replyFlag);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickView = () => {
        setViewFlag(!viewFlag);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickEdit = () => {
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
                comment.children.map(
                    (child) => (
                        console.log(child),
                        (
                            <Comment
                                key={child.id}
                                comment={child}
                                setRenderKey={setRenderKey}
                                reference_code={reference_code}
                                isReply={true}
                                setCommentsObj={setCommentsObj} // pass down the state setter
                            />
                        )
                    )
                )}
            {!isReply && (
                <button
                    onClick={handleClickReply}
                    className={replyFlag ? styles.isClick : ""}
                >
                    reply
                </button>
            )}
            {adminFlag && (
                <button onClick={() => removeComment(setRenderKey, comment.id)}>
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
                        onClick={(e) => handleClickReplyComment(e, comment.id)}
                    >
                        comment
                    </button>
                </>
            )}
        </div>
    );
}
