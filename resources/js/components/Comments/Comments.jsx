import { React } from "react";
import { useState, useEffect } from "react";
import useComments from "../useComments";
import { isEditable } from "@testing-library/user-event/dist/cjs/utils/index.js";
export default function Comments({ reference_code }) {
    const [commentsObj, setCommentsObj] = useState([]);
    const [replyCommentsObj, setReplyCommentsObj] = useState([]);
    const {
        fetchComments,
        sendComment,
        sendReplyComment,
        fetchChildren,
        editComment,
    } = useComments();
    const [commentContent, setCommentContent] = useState("");
    const [replyCommentContent, setReplyCommentContent] = useState("");
    const [replayArr, setReplayArr] = useState([]);
    const [replyViewFlag, setReplyViewFlag] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchComments(reference_code, 0);
            setCommentsObj(data);
        };

        fetchData();
    }, [reference_code]);

    const handleTextareaChange = (e, type) => {
        console.log(e.target.value);
        if (type === "reply") setReplyCommentContent(e.target.value);
        if (type === "comment") setCommentContent(e.target.value);
    };

    const handleClickButton = async (e) => {
        try {
            await sendComment(reference_code, commentContent);
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
        console.log(data);
        setReplyCommentsObj(data);
        setReplyViewFlag(!replyViewFlag);
    };

    const handleClickEdit = async (e, type, id) => {
        setIsEditable(!isEditable);
        if (isEditable === true && type === "comment")
            await editComment(reference_code, commentContent);
        if (isEditable === true && type === "reply")
            await editComment(reference_code, replyCommentContent);
    };

    const view =
        commentsObj.length < 1 ? (
            <div>
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
                    console.log(commentObj);
                    return commentObj.map((comment) => {
                        const temp = replayArr.includes(comment.id);
                        return (
                            <div key={comment.id} style={{ padding: "5px" }}>
                                <div>
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
                                            comment.id
                                        )
                                    }
                                >
                                    edit
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
                                                                style={{
                                                                    padding:
                                                                        "5px",
                                                                }}
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
                                                                            "reply"
                                                                        )
                                                                    }
                                                                >
                                                                    edit
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
                                                comment
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

    return <div>{view}</div>;
}
