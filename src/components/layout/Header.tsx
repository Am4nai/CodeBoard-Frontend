import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Закрытие дропдауна при клике вне области
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?query=${searchText}`)
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-8">
        {/* Логотип */}
        <Link to="/" className="text-xl font-bold text-text" onClick={() => {setSearchText("")}}>
          CodeBoard
        </Link>

        <form onSubmit={handleSubmit} className="flex grow pl-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchText}
            onChange={(e) => {setSearchText(e.target.value)}}
            className="grow rounded-lg px-4 py-1 bg-surface-lite focus:outline-none focus:bg-surface-lite-clicked transition-colors duration-200 ease-in-out text-text"
          />
        </form>

        {/* Навигация (десктоп) */}
        <nav className="px-12 hidden md:flex gap-6 text-text font-medium">
          <Link to="/" className="hover:text-primary-hover transition-colors duration-200 ease-in-out" onClick={() => {setSearchText("")}}>
            Home
          </Link>
          <Link to="/create" className="hover:text-primary-hover transition-colors duration-200 ease-in-out" onClick={() => {setSearchText("")}}>
            Create
          </Link>
          <Link to="/collections" className="hover:text-primary-hover transition-colors duration-200 ease-in-out" onClick={() => {setSearchText("")}}>
            Collections
          </Link>
        </nav>

        {/* Правая часть */}
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
              <Link
                to="/login"
                className="pr-4 py-1 text-text hover:text-primary-hover transition-colors duration-200 ease-in-out"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 bg-primary text-text rounded-md hover:bg-primary-hover transition-colors duration-200 ease-in-out"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Мобильный бургер */}
        <button
          className="md:hidden text-text hover:text-primary-hover pl-8"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 py-4 text-text font-medium bg-surface border-t">
          <Link to="/" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Home
          </Link>
          <Link to="/create" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Create
          </Link>
          <Link to="/collections" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
            Collections
          </Link>
          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className="hover:text-primary-hover transition-colors duration-200 ease-in-out"
              >
                Profile
              </Link>
              <Link to="/settings" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-error hover:text-error-hover transition-colors duration-200 ease-in-out"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
                Login
              </Link>
              <Link to="/register" className="hover:text-primary-hover transition-colors duration-200 ease-in-out">
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}