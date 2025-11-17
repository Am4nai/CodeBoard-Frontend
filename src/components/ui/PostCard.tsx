import React, { useState } from "react";
import type { PostCardProps } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import AddToCollectionModal from "./AddToCollectionModal";

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  authorName,
  createdAt,
  likes,
  comments,
  editable,
  mode,
  collectionId,
  fetchCollectionData,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <article
      className="flex-col inline-block w-full break-inside-avoid opacity-0 animate-fade-up transition-all duration-200 ease-in-out hover:scale-[1.05]"
      onClick={() => {
        navigate(editable ? `/edit/${id}` : `/post/${id}`
        )}}
    >
      <div className="flex flex-col h-full w-full max-w-md bg-bg rounded-2xl shadow-3xl hover:bg-surface transition-colors duration-200 ease-in-out text-text">
        <h3 className="font-bold mt-8 mx-4" >{title}</h3>
        <p className="text-sm leading-relaxed px-4 my-8">
          {description}
        </p>

        <footer className="flex justify-between items-center text-sm text-muted px-8 py-4 bg-surface rounded-b-2xl">
          <div className="flex gap-2">
            <span>{authorName}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-3 items-center">
            <span>{likes}❤️</span>
            <span>{comments}💬</span>

            {mode === "add" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                ➕
              </button>
            )}

            {mode === "remove" && collectionId && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!fetchCollectionData) return;
                  await api.delete(`/collections/${collectionId}/posts/${id}`);
                  fetchCollectionData();
                  alert("Пост удалён!");
                }}
                className="text-error hover:text-error-hover transition-colors"
              >
                🗑
              </button>
            )}

            {showModal && (
              <AddToCollectionModal
                postId={id}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};

export default PostCard;