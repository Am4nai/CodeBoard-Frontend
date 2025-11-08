import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import type { PostCardProps } from "../types/interfaces";
import PostCard from "../components/ui/PostCard";
import { api } from "../api/axiosInstance";

const SearchPage: React.FC = () => {
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
  

  const fetchPosts = async () => {
    console.log(query);
    
    try {
      const response = await api.get(`/posts/search?query=${query}&page=${page}&limit=15`);
      
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
    <main className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Searched posts</h1>
      <section>
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
      </section>
    </main>
  );
};

export default SearchPage;