import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import useUser from "../useUser";
import styles from "../Comments/comments.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function Comment({
    comment,
    setRenderKey,
    reference_code,
    isReply = false,
    adminFlag,
    setCommentsObj,
    parentId,
}) {
    const { removeComment } = useUser();
    const { isLogged, getUser } = authUser();
    const navigate = useNavigate();
    const { deleteComment, sendReplyComment, editComment } = useComments();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const currentAvatar = useRef(null);
    const currentBorder = useRef(null);
    const commentTextareaRef = useRef(null);
    const [replyFlag, setReplyFlag] = useState(false);
    const [viewFlag, setViewFlag] = useState(false);
    const [editUserFlag, setEditUserFlag] = useState(false);
    const [isTextareaClicked, setIsTextareaClicked] = useState(false);
    const [deleteUserFlag, setDeleteUserFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [replyCommentContent, setReplyCommentContent] = useState("");
    const [hovered, setHovered] = useState(false);

    const handleToggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleTextareaClick = () => {
        setIsTextareaClicked(true);
    };

    const handleCancelComment = () => {
        setIsTextareaClicked(false);
        setReplyCommentContent("");
        if (commentTextareaRef.current) {
            commentTextareaRef.current.textContent = "";
        }
    };

    useEffect(() => {
        const setVisibility = async () => {
            const user = await getUser();
            currentAvatar.current = user.avatar;
            if (user.current_border) {
                currentBorder.current = user.current_border.type;
            }

            if (user && user.id === comment.user_id) {
                setEditUserFlag(true);
                setDeleteUserFlag(true);
            }
        };
        setVisibility();
    }, [comment.user_id]);

    const handleClickDelete = async () => {
        const response = await deleteComment(comment.id);
        const deletedCommentId = response.data.Comment.id;

        if (parentId) {
            setCommentsObj((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) => {
                    if (comment.id === parentId) {
                        return {
                            ...comment,
                            children: comment.children.filter(
                                (child) => child.id !== deletedCommentId
                            ),
                            children_count: comment.children_count - 1,
                        };
                    }
                    return comment;
                }),
            }));
        } else {
            setCommentsObj((prev) => ({
                ...prev,
                comments: prev.comments.filter((c) => c.id !== comment.id),
            }));
        }

        // Ensure viewFlag is set to false if no children are left
        if (comment.children_count <= 1) {
            setViewFlag(false);
        }

        setRenderKey((prev) => prev + 1);
    };

    const handleClickRemoveComment = async () => {
        await removeComment(setRenderKey, comment.id);
        setCommentsObj((prev) => ({
            ...prev,
            comments: prev.comments.filter((c) => c.id !== comment.id),
        }));
    };

    const handleTextareaChange = (e) => {
        setReplyCommentContent(e.target.innerText);
    };

    const handleClickReply = () => {
        setReplyFlag(!replyFlag);
    };

    const handleClickReplyComment = async (e, id) => {
        if (!isLogged()) {
            navigate("/login");
            return;
        }
        setReplyCommentContent("");
        const response = await sendReplyComment(
            reference_code,
            replyCommentContent,
            id
        );

        const newReply = response.data.comment;
        setCommentsObj((prev) => {
            const updatedComments = prev.comments.map((c) => {
                if (c.id === id) {
                    return {
                        ...c,
                        children: [...(c.children ? c.children : []), newReply],
                        children_count: c.children_count + 1 || 1,
                    };
                }
                return c;
            });

            return { ...prev, comments: updatedComments };
        });

        setReplyFlag(!replyFlag);
        setViewFlag(false);
        setRenderKey((prev) => prev + 1);
    };

    const handleClickView = () => {
        setViewFlag(true);
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

    const handleMouseEnter = () => {
        if (comment.id) setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div
            className={
                isReply ? styles.replyContainer : styles.commentContainer
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.image_holder}>
                {!comment.user_avatar && currentAvatar.current ? (
                    <img
                        src={currentAvatar.current}
                        alt="avatar"
                        className={styles.profile_picture}
                    ></img>
                ) : (
                    <img
                        src={comment.user_avatar}
                        alt="avatar"
                        className={styles.profile_picture}
                    />
                )}

                {!comment.current_border && currentBorder.current ? (
                    <img
                        src={currentBorder.current}
                        className={styles.border}
                    ></img>
                ) : (
                    comment.current_border && (
                        <img
                            src={comment.current_border.type}
                            className={styles.border}
                        ></img>
                    )
                )}
            </div>
            <p>{comment.user_name}</p>
            <p className={styles.dateComm}>{comment.created_at}</p>
            <div>
                {hovered && (
                    <FontAwesomeIcon
                        icon={faEllipsisV}
                        onClick={handleToggleDropdown}
                        className={styles.replyMenu}
                    />
                )}

                <div
                    ref={dropdownRef}
                    className={`${styles.buttonsContainer} ${
                        isDropdownVisible ? styles.buttonsContainerVisible : ""
                    }`}
                >
                    {isLogged() && (
                        <Link to={`/report/comment/${comment.id}`}>
                            <button>Report comment</button>
                        </Link>
                    )}
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
                    {adminFlag && (
                        <button onClick={handleClickRemoveComment}>
                            Remove comment
                        </button>
                    )}
                </div>
            </div>
            <div
                className={styles.commentTextarea}
                contentEditable={isEditable}
                onInput={handleTextareaChange}
                onBlur={handleBlur}
                suppressContentEditableWarning={true}
            >
                {comment.content}
            </div>
            <div className={styles.replyButtonsContainer}>
                {!isReply && (
                    <button
                        onClick={handleClickReply}
                        className={`${styles.replyButton} ${
                            replyFlag ? styles.isClick : ""
                        }`}
                    >
                        Reply
                    </button>
                )}
                {comment.children_count > 0 && (
                    <button
                        onClick={handleClickView}
                        className={`${styles.replyButton} ${
                            viewFlag ? styles.isClick : ""
                        }`}
                    >
                        View replies {comment.children_count}
                    </button>
                )}
            </div>
            {viewFlag &&
                comment.children &&
                comment.children.map((child) => (
                    <Comment
                        key={child.id}
                        comment={child}
                        setRenderKey={setRenderKey}
                        reference_code={reference_code}
                        isReply={true}
                        setCommentsObj={setCommentsObj}
                        parentId={comment.id}
                    />
                ))}
            {replyFlag && (
                <>
                    <div className={styles.commentTextareaContainer}>
                        <div
                            ref={commentTextareaRef}
                            className={styles.commentTextarea}
                            contentEditable="true"
                            onInput={handleTextareaChange}
                            data-text="Add reply..."
                            onClick={handleTextareaClick}
                        ></div>
                        {isTextareaClicked && (
                            <div className={styles.replyButtonsContainer}>
                                <button
                                    onClick={(e) =>
                                        handleClickReplyComment(e, comment.id)
                                    }
                                    className={styles.acceptButton}
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={handleCancelComment}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
