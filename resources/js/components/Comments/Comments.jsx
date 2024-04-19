import { React } from "react";
import { useState } from "react";

export default function Comments({ commentsObj = [] }) {
    const [commentContent, setCommentContent] = useState("");
    const [reply, setReply] = useState(
        commentsObj.map((comment) => ({
            id: comment.id,
            reply: comment.replyFlag,
        }))
    );
    const [replyFlag, setReplyFlag] = useState(false);

    const handleTextareaChange = (e) => {
        console.log(e.target.value);
        setCommentContent(e.target.value);
    };

    const handleClickButton = (e) => {
        e.preventDefault();
        console.log(commentContent); // api call
    };

    const handleClickReply = (e, id) => {
        console.log(reply);
        setReply(
            reply.map((item) =>
                item.id === id ? { ...item, reply: !item.reply } : item
            )
        );
    };

    const view =
        commentsObj.length < 1 ? (
            <div>
                <p>No comments yet</p>
                <textarea onChange={(e) => handleTextareaChange(e)}></textarea>
                <button onClick={(e) => handleClickButton(e)}>Comment</button>
            </div>
        ) : (
            <>
                <textarea onChange={(e) => handleTextareaChange(e)}></textarea>
                <button onClick={(e) => handleClickButton(e)}>Comment</button>
                {commentsObj.map((comment) => {
                    const replyItem = reply.find(
                        (item) => item.id === comment.id
                    );
                    return (
                        <>
                            <div key={comment.id}>
                                <p>No comments yet</p>
                            </div>
                            <div>
                                <img src="dsa" alt="avatar"></img>
                                <p>{comment.username}</p>
                                <p>{comment.created_at}</p>
                                <textarea readOnly>{comment.comment}</textarea>
                            </div>
                            <button
                                onClick={(e) => handleClickReply(e, comment.id)}
                            >
                                reply
                            </button>
                            {replyItem && replyItem.reply && (
                                <textarea></textarea>
                            )}
                        </>
                    );
                })}
            </>
        );

    return <div>{view}</div>;
}
