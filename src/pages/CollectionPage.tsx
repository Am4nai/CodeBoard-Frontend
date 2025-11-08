import React, { useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import type { Collection, PostCardProps } from "../types/interfaces";
import Masonry from "react-masonry-css";
import PostCard from "../components/ui/PostCard";

const CollectionPage: React.FC = () => {
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  const [isCreating, setIsCreating] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [posts, setPosts] = useState<PostCardProps[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const response = await api.get(`/collections`);
      setCollections(response.data);
    } catch (err) {
      console.error("Ошибка загрузки коллекций:", err);
    }
  };

  const createCollection = async () => {
    try {
      await api.post("/collections", {name: title, description: description});
      fetchCollections();
    } catch (err) {
      console.log(err);
      
    }
  }

  const fetchCollectionData = async () => {
    if (!selectedCollection) return;
    try {
      const collection = await api.get(`collections/${selectedCollection.id}`)
            
      const mapped = collection.data.posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        code: p.code,
        language: p.language,
        createdAt: p.created_at,
        likes: p.like_count,
        comments: p.comment_count,
      }));
      console.log(mapped);
      setPosts(mapped);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionData();
    }
  }, [selectedCollection])

  return (
    <main className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Collections</h1>
      <section className="gap-2 flex flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
        <select
          className="bg-surface p-4 rounded-lg focus:outline-none focus:bg-surface-focus transition-all duration-200 ease-in-out"
          onChange={(e) => {
            const value = e.target.value;

            if (value === "create") {
              setIsCreating(true);
              setSelectedCollection(null);
              setTitle("");
              setDescription("");
            } else {
              setIsCreating(false);
              const found = collections.find(col => col.id === Number(value));
              setSelectedCollection(found || null);
              setTitle(found?.name || "");
              setDescription(found?.description || "");
            }
          }}
          defaultValue=""
        >
          <option value="" disabled hidden>
            Select collection...
          </option>
          <option value="create">➕ Create collection</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </section>
      {isCreating ? (
        <section className="mt-8 gap-2 flex flex-1 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
            <input
              placeholder="Title..."
              className="rounded-lg p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
              onChange={(e) => {setTitle(e.target.value)}}
              value={title}
            ></input>

            <label className="p-2">Description</label>
            <input
              placeholder="Description..."
              className="rounded-lg p-2 focus:outline-none bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out"
              onChange={(e) => {setDescription(e.target.value)}}
              value={description}
            />
            <button
              className="text-text-secondary bg-secondary hover:bg-secondary-hover transition-colors duration-200 ease-in-out rounded-lg min-h-12"
              onClick={createCollection}
            >
              Create
            </button>
        </section>
      ) : (
        <section className="mt-8">
          <div className="gap-2 flex flex-1 flex-col w-full rounded-2xl p-4 shadow-3xl justify-between bg-bg text-text">
            <input
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg p-2 bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out focus:outline-none"
            />

            <label className="p-2">Description</label>
            <input
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg p-2 focus:outline-none bg-surface focus:bg-surface-focus transition-colors duration-200 ease-in-out"
            />
            <div className="flex gap-16 justify-between">
              <button
                className="text-text-secondary bg-primary hover:bg-primary-hover transition-colors duration-200 ease-in-out rounded-lg min-h-10 grow"
                onClick={async () => {
                  if (!selectedCollection) return;
                  await api.put(`/collections/${selectedCollection.id}`, {
                    name: title,
                    description,
                  });
                  fetchCollections();
                }}
              >
                Update
              </button>

              <button
                className="text-text-secondary bg-error hover:bg-error-hover transition-colors duration-200 ease-in-out rounded-lg min-h-10 grow"
                onClick={async () => {
                  if (!selectedCollection) return;
                  await api.delete(`/collections/${selectedCollection.id}`);
                  setIsCreating(true);
                  setTitle("");
                  setDescription("");
                  fetchCollections();
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-8">
            {loading && <p>Загрузка...</p>}
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-6"
              columnClassName="space-y-6"
            >
              {posts.map(post => (
                <PostCard key={post.id} {...post}  mode="remove" collectionId={selectedCollection?.id} fetchCollectionData={fetchCollectionData}/>
              ))}
            </Masonry>
          </div>
        </section>
      )}
    </main>
  );
};

export default CollectionPage;