import React, { useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import CommentThread  from "../components/ui/CommentThread";
import type { Comment } from "../types/interfaces";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/autoloader/prism-autoloader.min.js";
Prism.plugins.autoloader.languages_path = "https://unpkg.com/prismjs@1.29.0/components/";

import heartoff from "../components/svg/heartoff.svg";
import hearton from "../components/svg/hearton.svg";
import comment from "../components/svg/comment.svg";



const PostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState("");
  const [like, setLike] = useState(heartoff);
  const [commentsHidden, setCommentsHidden] = useState(true);
  const [comments, setComments] = useState<Comment[]>();
  const [focusedCommentId, setFocusedCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");


  const { id } = useParams<{ id: string }>();

  const fetchPostById = async () => {
    try {
      const post = await api.get(`/posts/${id}`);
      const isLiked = await api.get(`/likes/${id}/is-liked`);
      if (isLiked.data.liked) setLike(hearton);
      else setLike(heartoff);
      setTitle(post.data.title);
      setDescription(post.data.description);
      setCode(post.data.code);
      setLanguage(post.data.language);
      setLikeCount(post.data.like_count);
      setCommentCount(post.data.comment_count);
      refreshComments();
    } catch (err) {
      setError("Error fetching post");
      console.log(err);
    }
  }

  const likeAndCommentCheck = async () => {
    const likeCount = await api.get(`likes/${id}/count`);
    setLikeCount(likeCount.data.count)
    const commentCount = await api.get(`/comments/post/${id}/count`);
    setCommentCount(commentCount.data.count)
  }

  const handleLikeSubmit = async () => {
    if (like == heartoff) {
      setLike(hearton);
      await api.post(`likes/${id}/toggle`);
      likeAndCommentCheck()
    }
    else {
      setLike(heartoff);
      await api.post(`likes/${id}/toggle`);
      likeAndCommentCheck();
    }
  }

  const handleCommentSubmit = () => {
    if (commentsHidden) {
      setCommentsHidden(false);
    }
    else {
      setCommentsHidden(true);
    }
  }

  const refreshComments = async () => {
    const commentsByPost = await api.get(`/comments/post/${id}`);
    setComments(commentsByPost.data);
  };


  const handleWriteComment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("post_id: ", id);
    console.log("content: ", commentText);
    console.log("parent_id: ", null);

    await api.post("/comments", {
      post_id: id,
      content: commentText,
      parent_id: null
    });
    refreshComments();
  }

  useEffect(() => {
    fetchPostById();
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    if (code) {
      Prism.highlightAll();
    }
  }, [code])
  
  useEffect(() => {
    if (!commentsHidden) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 2);
    }
  }, [commentsHidden])

  return (
    <main className="p-6 text-text">
      <div className="flex flex-col lg:flex-row gap-8 justify-between h-auto lg:h-[calc(90vh-8rem)] opacity-0 animate-fade-up">
        <form className="gap-2 flex flex-2 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
          <input
            placeholder="Title..."
            className="rounded-sm p-2 bg-surface transition-colors duration-200 ease-in-out"
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
            disabled={true}
          />

          <label className="px-2 pt-2">Code</label>
          
          <pre
            className="!bg-surface rounded-sm grow resize-none h-[calc(80vh-8rem)] transition-colors duration-200 ease-in-out"
          >
            <code className={`language-${language.toLowerCase()}`}>
              {code}
            </code>
          </pre>
        </form>
        <form className="gap-2 flex flex-1 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
          <input
            placeholder="Language..."
            className="rounded-sm p-2 bg-surface transition-colors duration-200 ease-in-out"
            value={language}
            onChange={(e) => {setLanguage(e.target.value)}}
            disabled={true}
          />

          <label className="p-2">Description</label>
          <textarea
            className="bg-surface rounded-sm p-2 grow resize-none h-[calc(80vh-8rem)] transition-colors duration-200 ease-in-out"
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
            disabled={true}
          />
          <div className="flex justify-end gap-4">
            <p>{likeCount}</p>
            <img className="h-10" src={like} alt="like" onClick={() => {handleLikeSubmit()}}/>
            <p>{commentCount}</p>
            <img className="h-10" src={comment} alt="like" onClick={() => {handleCommentSubmit()}}/>
          </div>
        </form>
      </div>
      <div 
        className="my-8 flex flex-col gap-4 h-[70vh] overflow-y-auto p-4 
             opacity-0 animate-fade-up shadow-3xl bg-bg text-text rounded-2xl scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        hidden={commentsHidden}
      >
        <div className="flex flex-row justify-between">
          <label className="p-4">Comments</label>
          <label className="p-4" onClick={() => { setCommentsHidden(true) }}>Hide</label>
        </div>
        <form
          className="flex justify-between mx-4 gap-4"
          onSubmit={handleWriteComment}
        >
          <textarea
            className="grow rounded-2xl px-4 py-2 bg-surface-lite focus:outline-none focus:bg-surface-lite-clicked transition-colors duration-200 ease-in-out resize-none text-text"
            placeholder="Write comment..."
            value={commentText}
            onChange={(e) => {setCommentText(e.target.value)}}
            onClick={() => {setFocusedCommentId(Number(id))}}
          />
          <button className="bg-primary hover:bg-primary-hover rounded-2xl px-8">Write</button>
        </form>
        <div className="grow">
          {comments && comments.map((c) => (   
            <CommentThread
              key={c.id}
              comment={c}
              level={0}
              post_id={Number(id)}
              focusedCommentId={focusedCommentId}
              setFocusedCommentId={setFocusedCommentId}
              refreshComments={refreshComments}
            />

          ))}
        </div>

      </div>
    </main>
  );
};

export default PostPage;