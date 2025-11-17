import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import type { PostCardProps } from "../types/interfaces";
import PostCard from "../components/ui/PostCard";
import { api } from "../api/axiosInstance";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  const isThrottled = useRef(false);
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [page, setPage] = useState(1);

  const fetchPosts = async (reset = false) => {
    if (!query) return;
    console.log(query);

    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/posts/search?query=${encodeURIComponent(query)}&page=${page}&limit=15`);
      

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

      setPosts((prev) => (reset ? mapped : [...prev, ...mapped]));
    } catch (err) {
      setError("Error fetching posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (isThrottled.current) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1);
      isThrottled.current = true;
      setTimeout(() => (isThrottled.current = false), 500);
    }
  };

  const parseQuery = (raw: string) => {
    const parts = raw.split(" ").filter(Boolean);
    const tags = parts.filter(w => w.startsWith("#"));

    return { tags };
  };

  const { tags } = parseQuery(query);

  const removeTag = (tagToRemove: string) => {
    const newQuery = query
      .split(" ")
      .filter(w => w !== tagToRemove)
      .join(" ");

    navigate(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  // Следим за изменением query → сбрасываем результаты
  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts(true);
  }, [location.search]);

  // Подгружаем посты при скролле (если query есть)
  useEffect(() => {
    if (page > 1) fetchPosts();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="p-6 text-text">
      {tags.map((tag, idx) => (
        <button
          key={idx}
          className="px-3 py-1 bg-primary text-text rounded-lg hover:bg-primary-hover transition cursor-pointer"
          onClick={() => removeTag(tag)}
        >
          {tag} ×
        </button>
      ))}
      <h1 className="text-3xl font-bold mb-4">
        Results for: <span className="text-primary">{query}</span>
      </h1>
      {error && <p className="text-error">{error}</p>}
      {loading && <p>Загрузка...</p>}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-6"
        columnClassName="space-y-6"
      >
        {posts.map((post) => (
          <PostCard key={post.id} {...post} mode="add" />
        ))}
      </Masonry>
    </main>
  );
};

export default SearchPage;
