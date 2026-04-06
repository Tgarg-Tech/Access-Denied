import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Users, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  onNavigate: (page: string, hackathonId?: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile, logout } = useProfile();
  const { user, logout: signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isPublicNav =
    !user || currentPage === "landing" || currentPage.startsWith("auth-");
  const profileInitial = (
    profile.fullName?.trim().charAt(0) || "U"
  ).toUpperCase();

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (isDropdownOpen && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [isDropdownOpen]);

  const mainNav = [
    { label: "Hackathons", page: "dashboard" },
    { label: "Matching", page: "matching" },
    { label: "Explore", page: "explore" },
    { label: "Teams", page: "team" },
  ];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else onNavigate("landing");
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 overflow-visible backdrop-blur-md bg-[#F8FAFC]/80 dark:bg-[#0B1020]/80"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 landing-mesh opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] ambient-line" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="glass-panel rounded-2xl border border-white/70 dark:border-white/15 px-4 sm:px-5 py-3 flex items-center justify-between gap-4 sm:gap-6 shadow-lg shadow-[#6878ff]/10 overflow-visible">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ff7e4c] to-[#5f73ff] shadow-lg shadow-[#6777ff]/25">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div
                  className={`font-display text-lg font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  HackMate
                </div>
                <div
                  className={`text-xs ${theme === "dark" ? "text-[#aeb8e2]" : "text-[#596893]"} -mt-0.5`}
                >
                  Build. Team. Ship.
                </div>
              </div>
            </button>
          </div>

          {isPublicNav ? (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("landing")}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  currentPage === "landing"
                    ? "bg-gradient-to-r from-[#ff7e4c]/20 to-[#5f73ff]/20 text-[#4c5cf4] dark:text-[#bfc7ff]"
                    : theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => scrollToId("how-it-works")}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                How it works
              </button>

              <button
                onClick={() => scrollToId("features")}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                Features
              </button>

              <button
                onClick={() => scrollToId("about")}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                About
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              {mainNav.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                    currentPage === item.page
                      ? "bg-gradient-to-r from-[#ff7e4c]/20 to-[#5f73ff]/20 text-[#4c5cf4] dark:text-[#bfc7ff]"
                      : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => scrollToId("features")}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                Features
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-white/5 border border-white/10 hover:bg-white/10"
                  : "bg-white/75 border border-white hover:bg-white"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-[#ffd785]" />
              ) : (
                <Moon className="w-5 h-5 text-[#4c5af4]" />
              )}
            </motion.button>

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("auth-login")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    theme === "dark"
                      ? "border-white/15 text-[#c4cdf0] hover:bg-white/10"
                      : "border-white text-[#4f5ef2] hover:bg-white"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate("auth-signup")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#ff7e4c] to-[#5f73ff] hover:opacity-90 transition-opacity shadow-lg shadow-[#6676ff]/25"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDropdownOpen((s) => !s)}
                  className="flex items-center gap-2 rounded-full p-1.5 bg-gradient-to-br from-[#ff7e4c] to-[#5f73ff] border border-[#8c96ff]/40 hover:shadow-lg hover:shadow-[#6676ff]/30 transition-all"
                  aria-label="Open account menu"
                >
                  <span className="w-8 h-8 rounded-full bg-white/95 text-[#4f5ef2] font-bold text-sm flex items-center justify-center">
                    {profileInitial}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute right-0 mt-3 w-48 md:w-56 rounded-xl shadow-2xl overflow-hidden border ${
                        theme === "dark"
                          ? "shadow-black/40 bg-gradient-to-b from-[#11182f]/95 to-[#0b1226]/95 border-[#8f9cff]/20"
                          : "shadow-slate-300/50 bg-gradient-to-b from-[#f8f9ff] to-white border-white"
                      }`}
                    >
                      <div className="h-1 bg-gradient-to-r from-[#ff7e4c] via-[#5f73ff] to-[#38d8ff]" />

                      <div
                        className={`p-4 border-b ${theme === "dark" ? "border-white/10" : "border-slate-300/50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff7e4c] to-[#5f73ff] flex items-center justify-center text-white font-bold text-lg">
                            {profileInitial}
                          </div>
                          <div>
                            <div
                              className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                            >
                              {profile.fullName}
                            </div>
                            <div
                              className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}
                            >
                              {profile.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <button
                          onClick={() => {
                            onNavigate("my-profile");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === "dark"
                              ? "hover:bg-white/10 text-gray-200"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="w-9 h-9 rounded-md flex items-center justify-center bg-gradient-to-br from-[#ff7e4c] to-[#5f73ff] text-white">
                            <Settings className="w-4 h-4" />
                          </span>
                          My Profile
                        </button>
                      </div>

                      <div
                        className={`px-3 py-3 border-t ${theme === "dark" ? "border-white/10" : "border-slate-300/50"}`}
                      >
                        <button
                          onClick={async () => {
                            await signOut();
                            logout();
                            onNavigate("landing");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 text-sm rounded-md px-3 py-2 transition-colors ${
                            theme === "dark"
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
