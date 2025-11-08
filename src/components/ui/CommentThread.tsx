import React, { useState } from "react";
import type { CommentThreadProps } from "../../types/interfaces";
import { api } from "../../api/axiosInstance";

const CommentThread: React.FC<CommentThreadProps> = ({ comment, post_id, focusedCommentId, setFocusedCommentId, refreshComments }) => {
  const isFocused = focusedCommentId === comment.id;
  const [commentText, setCommentText] = useState("");

  const handleClick = () => {
    setFocusedCommentId(isFocused ? null : comment.id);
  };

  const createComment = async () => {
    await api.post("/comments", {
      post_id: post_id,
      content: commentText,
      parent_id: comment.id,
    });
    setFocusedCommentId(null);
    refreshComments();
  };

  return (
    <div className="relative pl-4">
      <div
        className="flex justify-between p-3 rounded-xl bg-surface shadow-sm mr-4 animate-fade-up transition-all duration-200 ease-in-out hover:scale-[1.015]"
        onClick={handleClick}
      >
        <section className="flex flex-col">
          <p className="font-semibold">{comment.username}</p>
          <p className="text-sm text-text-secondary">{comment.content}</p>
        </section>
      </div>

      { isFocused && <div className="flex justify-between mt-2 rounded-xl gap-4 mr-4 animate-fade-up transition-all duration-200 ease-in-out">
        <textarea
          placeholder="Enter answer..."
          className="grow rounded-lg px-4 py-1 bg-surface-lite focus:outline-none focus:bg-surface-lite-clicked transition-colors duration-200 ease-in-out text-text"
          value={commentText}
          onChange={(e) => { setCommentText(e.target.value)}}
        />
        <button className="bg-secondary hover:bg-secondary-hover rounded-2xl px-4" onClick={createComment}>Answer</button>
      </div> }

      {/* replies */}
      <div className="mt-2 ml-4 space-y-2 border-l rounded-bl-2xl border-border">
        {comment.replies.map((reply) => (
          <CommentThread
            key={reply.id}
            comment={reply}
            level={0}
            post_id={reply.post_id}
            focusedCommentId={focusedCommentId}
            setFocusedCommentId={setFocusedCommentId}
            refreshComments={refreshComments}
          />

        ))}
      </div>
    </div>
  )
}

export default CommentThread;