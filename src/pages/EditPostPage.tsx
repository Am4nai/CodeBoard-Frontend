import React, { useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";


const EditPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [postId, setPostId] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    const post = await api.get(`/posts/${id}`);
    setPostId(post.data.id);
    setTitle(post.data.title);
    setCode(post.data.code);
    setLanguage(post.data.language);
    setDescription(post.data.description);
    setLoading(false);
  }

  const postUpdate = async () => {
    await api.put(`/posts/${postId}`, { title, code, language, description });
    navigate(`/profile/${user.id}`)
  }

  const postDelete = async () => {
    await api.delete(`/posts/${postId}`);
  }

  useEffect(() => {
    fetchPost();
  },[])

  return (
    <main className="p-6 text-gray-200 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col lg:flex-row gap-8 justify-between lg:h-[calc(90vh-8rem)] opacity-0 animate-fade-up">
        <form className="gap-2 flex flex-2 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
          <input
            placeholder="Title..."
            className="rounded-sm p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
          ></input>

          <label className="p-2">Code</label>
          <textarea
            className="bg-surface focus:bg-surface-focus rounded-sm p-2 focus:outline-none h-[calc(80vh-8rem)] resize-none transition-colors duration-200 ease-in-out"
            value={code}
            onChange={(e) => {setCode(e.target.value)}}
          />
        </form>
        <form className="gap-2 flex flex-1 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
          <input
            placeholder="Language..."
            className="rounded-sm p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
            value={language}
            onChange={(e) => {setLanguage(e.target.value)}}
          ></input>

          <label className="p-2">Description</label>
          <textarea
            className="rounded-sm p-2 focus:outline-none h-[calc(80vh-8rem)] resize-none bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out"
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
          />
          <button type="button" className="text-text bg-primary hover:bg-primary-hover transition-colors duration-200 ease-in-out rounded-sm min-h-12" disabled={loading} onClick={postUpdate}>
            Update
          </button>
          <button type="button" className="text-text bg-error hover:bg-error-hover transition-colors duration-200 ease-in-out rounded-sm min-h-12" disabled={loading} onClick={postDelete}>
            Delete
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditPostPage;