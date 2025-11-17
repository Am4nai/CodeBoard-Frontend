import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";

export default function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        fail();
        return;
      }

      try {
        await api.get("/auth/verify"); // backend проверяет JWT
        setIsValid(true);
      } catch (err) {
        fail();
      }
    };

    const fail = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsValid(false);
    };

    checkToken();
  }, []);

  // Показать загрузку пока проверяем
  if (isValid === null) return <p>Checking auth...</p>;

  if (!isValid) return <Navigate to="/login" replace />;

  return children;
}
