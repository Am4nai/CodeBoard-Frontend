import React, { useState, useEffect, useRef } from "react";
import PostCard from "../components/ui/PostCard";
import type { PostCardProps } from "../types/interfaces";
import { api } from "../api/axiosInstance"
import Masonry from "react-masonry-css";

const HomePage: React.FC = () => {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const isThrottled = useRef(false);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=15`);
      
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

  const handleScroll = () => {
    if (isThrottled.current) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage(prev => prev + 1);
      isThrottled.current = true;
      setTimeout(() => (isThrottled.current = false), 500);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <main className="p-6 text-text">
      {error && <p className="text-error">{error}</p>}
      {loading && <p>Загрузка...</p>}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-6"
        columnClassName="space-y-6"
      >
        {posts.map(post => (
          <PostCard key={post.id} {...post} mode="add" />
        ))}
      </Masonry>
    </main>
  );
};

export default HomePage;