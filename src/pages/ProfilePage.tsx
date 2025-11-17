import React, { useState, useEffect } from "react";
import type { PostCardProps } from "../types/interfaces";
import PostCard from "../components/ui/PostCard";
import { api } from "../api/axiosInstance";
import Masonry from "react-masonry-css";
import { useParams } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  const { id } = useParams<{ id: string }>();
  const authUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = authUser?.id === Number(id);
  const [posts, setPosts] = useState<PostCardProps[]>([]);

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [Role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  
  const handleThemeChange = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
  
  const fetchPosts = async () => {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      
      const mapped = response.data.posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        code: p.code,
        language: p.language,
        authorName: p.author_name,
        createdAt: p.created_at,
        likes: p.like_count,
        comments: p.comment_count,
      }));

      setPosts(prev => [...prev, ...mapped]);
    } catch (err) {
      setError("Error fetching posts")
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    try {
      const userInfo = await api.put(`/users/${userId}`, { username, email, avatarUrl, bio });
      console.log(userInfo);

      getProfile();
    } catch (err) {
      console.log(err);
      
    }
  }

  const getProfile = async () => {
    try {
      const user = await api.get(`/users/${id}`);

      setUserId(user.data.id);
      setUsername(user.data.username);
      setRole(user.data.role);
      setEmail(user.data.email);
      setBio(user.data.bio);
      setCreatedAt(user.data.created_at);
      setAvatarUrl(user.data.avatar_url);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProfile();
    setLoading(true);
    setPosts([]);
  }, [id]);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
    
  }, [userId])

  return (
    <main className="p-6 text-text">
      <section className="relative flex flex-row rounded-2xl bg-bg shadow-3xl p-6 mb-6 gap-8 justify-between animate-fade-up transition-all duration-200 ease-in-out z-1">
        <form className="flex flex-1 flex-col items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <img
            src={"https://placehold.co/32x32"}
            alt="avatar"
            className="w-32 h-32 rounded-full border my-4"
          />
          <input disabled={!isOwner} type="text" className="text-center" value={username} onChange={(e) => { setUsername(e.target.value)}}></input>
          <input disabled={!isOwner} type="text" className="text-center" value={email} onChange={(e) => { setEmail(e.target.value)}}></input>
        </form>

        <form className="flex flex-col flex-4 gap-4">
          <textarea
            disabled={!isOwner}
            className="bg-surface grow rounded-2xl resize-none p-4 focus:bg-surface-focus focus:outline-none transition-colors duration-200 ease-in-out text-text"
            value={bio}
            onChange={(e) => { setBio(e.target.value) }}
          />
          <p className="text-end">Account created at: {new Date(createdAt).toLocaleDateString()}</p>
        </form>
      </section>

      <section className="relative flex grow justify-end z-2 animate-fade-up transition-all duration-200 ease-in-out">
        {isOwner && <button
          className="bg-primary rounded-2xl px-4 py-2 hover:bg-primary-hover transition-all duration-200 ease-in-out text-text hover:scale-[1.05]"
          onClick={updateProfile}
        >
          Update
        </button>}
      </section>

      <section
        className="flex flex-col flex-4 p-6 animate-fade-up transition-all duration-200 ease-in-out"
      >
        {!loading && <h2 className="text-xl font-semibold mb-4">My posts</h2>}
        {error && <p className="text-error">{error}</p>}
        {loading && <p>Загрузка...</p>}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-6"
          columnClassName="space-y-6"
        >
          {posts.map(post => (
            <PostCard key={post.id} {...post} editable={isOwner} mode="add"/>
          ))}
        </Masonry>
      </section>
    </main>
  );
};

export default ProfilePage;