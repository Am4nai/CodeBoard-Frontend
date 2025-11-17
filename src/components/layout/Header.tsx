import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../api/axiosInstance";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // user search
  const [userResults, setUserResults] = useState([]);
  const [showUserResults, setShowUserResults] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const typingTimer = useRef<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setSearchText(q);
  }, [location.search]);

  // Закрытие dropdown'ов при клике вне области
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowUserResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowUserResults(false);
    navigate(`/search?query=${encodeURIComponent(searchText)}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);

    if (value.startsWith("#")) {
      setShowUserResults(false);
      return;
    }

    if (value.trim().length === 0) {
      setShowUserResults(false);
      return;
    }

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    if(value.startsWith("@")) {
      typingTimer.current = window.setTimeout(async () => {
        try {
          setIsLoadingUsers(true);
          value = value.replace("@", "");
          const res = await api.get(`/users/search?query=${value}`);
          console.log(res);
          setUserResults(res.data.results || []);
          setShowUserResults(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingUsers(false);
        }
      }, 250);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-8">
        <Link
          to="/"
          className="text-xl font-bold text-text"
          onClick={() => {
            setSearchText("");
            setShowUserResults(false);
          }}
        >
          CodeBoard
        </Link>

        {/* поиск */}
        <form onSubmit={handleSubmit} className="flex grow pl-8 relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search posts or users..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="grow rounded-lg px-4 py-1 bg-surface-lite focus:outline-none focus:bg-surface-lite-clicked transition-colors duration-200 ease-in-out text-text"
          />

          {/* dropdown пользователей */}
          {showUserResults && (
            <div className="absolute left-0 top-[110%] w-full max-w-lg bg-surface border border-border rounded-lg shadow-xl p-2 z-50">
              {isLoadingUsers && (
                <p className="p-2 text-text">Searching...</p>
              )}

              {!isLoadingUsers && userResults.length === 0 && (
                <p className="p-2 text-text">No users found</p>
              )}

              {userResults.map((u: any) => (
                <div
                  key={u.id}
                  onClick={() => {
                    navigate(`/profile/${u.id}`);
                    setShowUserResults(false);
                    setSearchText("");
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-bg cursor-pointer rounded-md transition-colors"
                >
                  <img
                    src={u.avatar_url || "https://placehold.co/32x32"}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-text">{u.username}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Навигация (desktop) */}
        <nav className="px-12 hidden md:flex gap-6 text-text font-medium">
          <Link to="/" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Home
          </Link>
          <Link to="/create" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Create
          </Link>
          <Link to="/collections" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Collections
          </Link>
        </nav>

        {/* Профиль */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:text-primary-hover transition-colors duration-200 ease-in-out"
              >
                <img
                  src={user.avatar_url || "https://placehold.co/32x32"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-medium">{user.username}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors duration-200 ease-in-out"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors duration-200 ease-in-out"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-bg transition-colors duration-200 ease-in-out"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="pr-4 py-1 text-text hover:text-primary-hover">
                Login
              </Link>
              <Link to="/register" className="px-4 py-1 bg-primary text-text rounded-md hover:bg-primary-hover">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-text hover:text-primary-hover pl-8"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
