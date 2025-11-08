import React, { useState } from "react";
import { api } from "../api/axiosInstance";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      setError("Пользователь не найден. Войдите в систему.");
      console.log(error);
      return;
    }

    if (!title || !description || !code || !language) {
      setError("Все поля должны быть заполнены.");
      console.log(error);
      return;
    }


    const author_id = user.id;
    try {
      setLoading(true);
      await api.post("/posts",{ author_id, title, description, code, language })
      console.log("Post created");
      alert("Post created");

      setTitle("");
      setDescription("");
      setCode("");
      setLanguage("");
      setError("");
    } catch (err) {
      console.log("Error create post");
      setError("Error create post");
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="p-6 text-gray-200 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col lg:flex-row gap-8 justify-between lg:h-[calc(90vh-8rem)] opacity-0 animate-fade-up">
        <form className="gap-2 flex flex-2 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
          <input
            placeholder="Title..."
            className="rounded-lg p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
          ></input>

          <label className="p-2">Code</label>
          <textarea
            className="bg-surface focus:bg-surface-focus rounded-lg p-2 focus:outline-none h-[calc(80vh-8rem)] resize-none transition-colors duration-200 ease-in-out"
            value={code}
            onChange={(e) => {setCode(e.target.value)}}
          />
        </form>
        <form className="gap-2 flex flex-1 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text" onSubmit={handleSubmit}>
          <input
            placeholder="Language..."
            className="rounded-lg p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
            value={language}
            onChange={(e) => {setLanguage(e.target.value)}}
          ></input>

          <label className="p-2">Description</label>
          <textarea
            className="rounded-lg p-2 focus:outline-none h-[calc(80vh-8rem)] resize-none bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out"
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
          />
          <button className="text-text-secondary bg-secondary hover:bg-secondary-hover transition-colors duration-200 ease-in-out rounded-lg min-h-12" disabled={loading}>
            Create
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreatePostPage;