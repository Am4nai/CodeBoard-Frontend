import { useEffect, useState } from "react";
import { api } from "../api/axiosInstance";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // локальные поля формы
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadUserById = async (id: number) => {
    try {
      setError("");
      const res = await api.get(`/admin/users/${id}`);
      const user: AdminUser = res.data;
      setSelectedUser(user);
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
    } catch (err) {
      console.error(err);
      setError("Failed to load user details");
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      setError("");
      await api.put(`/admin/users/${selectedUser.id}`, {
        username,
        email,
        role,
        bio,
        avatar_url: avatarUrl,
      });
      await loadUsers();          // обновить список
      await loadUserById(selectedUser.id); // обновить форму
    } catch (err) {
      console.error(err);
      setError("Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!confirm(`Delete user "${selectedUser.username}"?`)) return;

    try {
      setError("");
      await api.delete(`/admin/users/${selectedUser.id}`);
      setSelectedUser(null);
      setUsername("");
      setEmail("");
      setRole("user");
      setBio("");
      setAvatarUrl("");
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="p-6 text-text min-h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold mb-6">Admin panel — users</h1>

      {error && <p className="text-error mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список пользователей */}
        <section className="lg:col-span-1 bg-bg rounded-2xl shadow-3xl p-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-surface transition-colors duration-200 ${
                  selectedUser?.id === u.id ? "bg-surface" : ""
                }`}
                onClick={() => loadUserById(u.id)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar_url || "https://placehold.co/32x32"}
                    alt={u.username}
                    className="w-8 h-8 rounded-full border"
                  />
                  <div>
                    <p className="font-medium">{u.username}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-surface-lite text-text">
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Форма редактирования */}
        <section className="lg:col-span-2 bg-bg rounded-2xl shadow-3xl p-6 flex flex-col gap-4">
          {selectedUser ? (
            <>
              <h2 className="text-xl font-semibold mb-2">
                Edit user #{selectedUser.id}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Username</label>
                  <input
                    className="w-full rounded-lg px-3 py-2 bg-surface focus:bg-surface-focus focus:outline-none transition-colors duration-200"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Email</label>
                  <input
                    className="w-full rounded-lg px-3 py-2 bg-surface focus:bg-surface-focus focus:outline-none transition-colors duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Role</label>
                  <select
                    className="w-full rounded-lg px-3 py-2 bg-surface focus:bg-surface-focus focus:outline-none transition-colors duration-200"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm">Avatar URL</label>
                  <input
                    className="w-full rounded-lg px-3 py-2 bg-surface focus:bg-surface-focus focus:outline-none transition-colors duration-200"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm">Bio</label>
                <textarea
                  className="w-full rounded-lg px-3 py-2 bg-surface focus:bg-surface-focus focus:outline-none transition-colors duration-200 resize-none min-h-24"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <p className="text-sm text-muted text-right">
                Account created at:{" "}
                {new Date(selectedUser.created_at).toLocaleString()}
              </p>

              <div className="flex gap-4 justify-end mt-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-text transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-error hover:bg-error-hover text-text transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p className="text-muted">Select user from the list to edit.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
