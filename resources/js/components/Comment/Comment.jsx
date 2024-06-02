import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useComments from "../useComments";
import authUser from "../authUser";
import useUser from "../useUser";
import styles from "../Comments/comments.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function Comment({
    comment,
    setRenderKey,
    reference_code,
    isReply,
    adminFlag,
    setCommentsObj,
}) {
    const { removeComment } = useUser();
    const { isLogged, getUser } = authUser();
    const navigate = useNavigate();
    const {
        deleteComment,
        sendReplyComment,
        fetchChildrenComments,
        editComment,
    } = useComments();
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
        setMainCommentContent("");
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
        await deleteComment(comment.id);
        console.log(comment.id);
        setRenderKey((prev) => prev + 1);

        setCommentsObj((prev) => ({
            ...prev,
            comments: prev.comments.filter((c) => c.id !== comment.id),
        }));
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
        console.log("id", id);
        setReplyCommentContent("");
        const response = await sendReplyComment(
            reference_code,
            replyCommentContent,
            id
        );

        const newReply = response.data.comment;
        setCommentsObj((prev) => {
            const updatedComments = prev.comments.map((c) => {
                console.log(c.id, id);
                if (c.id === id) {
                    console.log(c);
                    return {
                        ...c,
                        children: [...(c.children ? c.children : []), newReply],
                        children_count: c.children_count + 1 || 1, // potentially error
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

    const handleMouseEnter = () => {
        if (comment.id) setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div
            className={isReply ? styles.replyContainer : ""}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!comment.user_avatar && currentAvatar.current ? (
                <img
                    src={currentAvatar.current}
                    style={{ width: "50px", height: "50px" }}
                    alt="avatar"
                ></img>
            ) : (
                <img
                    src={comment.user_avatar}
                    style={{ width: "50px", height: "50px" }}
                    alt="avatar"
                />
            )}

            {!comment.current_border && currentBorder.current ? (
                <img
                    src={currentBorder.current}
                    style={{ width: "50px", height: "50px" }}
                ></img>
            ) : (
                comment.current_border && (
                    <img
                        src={comment.current_border.type}
                        style={{ width: "50px", height: "50px" }}
                    ></img>
                )
            )}
            <p>{comment.user_name}</p>
            <p className={styles.dateComm}></p>
            <div>
                {hovered && (
                    <FontAwesomeIcon
                        icon={faEllipsisV}
                        onClick={handleToggleDropdown}
                        className={styles.commMenu}
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
                        <button onClick={() => handleClickRemoveComment()}>
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
                    View {comment.children_count}
                </button>
            )}
            {viewFlag &&
                comment.children.map((child) => (
                    <Comment
                        key={child.id}
                        comment={child}
                        setRenderKey={setRenderKey}
                        reference_code={reference_code}
                        isReply={true}
                        setCommentsObj={setCommentsObj} // pass down the state setter
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
                            onClick={handleTextareaClick}
                            data-text="Write comment..."
                        ></div>
                        {isTextareaClicked && (
                            <div>
                                <button
                                    onClick={(e) =>
                                        handleClickReplyComment(e, comment.id)
                                    }
                                >
                                    Comment
                                </button>
                                <button
                                    onClick={(e) => handleCancelComment(e)}
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
