// src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center text-gray-200">
      <h1 className="text-6xl font-bold mb-4 text-blue-500">404</h1>
      <p className="text-lg mb-6">Страница не найдена</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-800 transition-colors"
      >
        На главную
      </Link>
    </main>
  );
};

export default NotFoundPage;
