import { useState, useRef, useEffect } from "react";
import {
  Moon,
  Sun,
  Users,
  User,
  LogOut,
  Bell,
  Settings,
  Grid,
  ChevronDown,
  Trophy,
  Star,
} from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 relative overflow-visible ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#2D1B24] via-[#3D212E] to-[#2D1B24]"
          : "bg-gradient-to-r from-palette-card via-palette-section to-palette-card"
      }`}
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-b from-palette-accent-primary/10 to-transparent"
              : "bg-gradient-to-b from-palette-accent-primary/5 to-transparent"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-[1px] ${
            theme === "dark"
              ? "bg-gradient-to-r from-palette-accent-primary/30 via-palette-accent-primary/10 to-transparent"
              : "bg-gradient-to-r from-palette-border via-palette-border/50 to-transparent"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-palette-accent-primary to-palette-accent-secondary shadow-lg shadow-palette-accent-primary/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div
                   className={`text-lg font-extrabold ${theme === "dark" ? "text-white" : "text-palette-text-primary"}`}
                >
                  HackMate
                </div>
                <div
                  className={`text-xs ${theme === "dark" ? "text-palette-accent-secondary" : "text-palette-accent-primary"} -mt-0.5`}
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
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => scrollToId("how-it-works")}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                How it works
              </button>

              <button
                onClick={() => scrollToId("features")}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Features
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              {mainNav.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.page
                      ? "text-palette-accent-primary bg-palette-accent-primary/10"
                      : theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-palette-text-secondary hover:text-palette-text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => scrollToId("features")}
                className={`text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Features
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {profile.pastHackathons?.length > 0 && (
              <div
                className={`hidden md:flex flex-col items-center justify-center px-3 py-1 rounded-lg border leading-tight ${
                  theme === "dark"
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                    : "bg-yellow-50 border-yellow-200 text-yellow-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">
                    {(
                      profile.pastHackathons.reduce(
                        (acc: number, h: any) =>
                          acc + (h.review?.averageRating || 0),
                        0,
                      ) / profile.pastHackathons.length
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase opacity-80 tracking-tighter">
                  {profile.pastHackathons.length} Hackathons
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20"
                  : "bg-slate-200 border border-slate-300 hover:bg-slate-300"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-violet-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("team")}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === "team"
                  ? "bg-violet-500 border-violet-500 text-white"
                  : "bg-white dark:bg-[#121A2B] border-black/10 dark:border-white/10 hover:border-violet-500 dark:hover:border-violet-500 text-[#0F172A] dark:text-[#F8FAFC]"
              }`}
              aria-label="Team"
            >
              <Users className="w-5 h-5" />
            </motion.button>

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("auth-login")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    theme === "dark"
                      ? "border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                      : "border-violet-300 text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate("auth-signup")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-palette-accent-primary to-palette-accent-secondary hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDropdownOpen((s) => !s)}
                  className="flex items-center gap-2 rounded-full p-1.5 bg-gradient-to-br from-violet-500 to-blue-500 border border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                  aria-label="Open account menu"
                >
                  <span className="w-8 h-8 rounded-full bg-white/95 text-violet-700 font-bold text-sm flex items-center justify-center">
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
                          ? "shadow-black/40 bg-gradient-to-b from-[#17102a] to-[#0f172a] border-violet-500/20"
                          : "shadow-slate-300/50 bg-gradient-to-b from-slate-50 to-white border-slate-200"
                      }`}
                    >
                      <div className="h-1 bg-gradient-to-r from-violet-500 to-blue-500" />

                      <div
                        className={`p-4 border-b ${theme === "dark" ? "border-violet-500/10" : "border-slate-300/50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
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
                              ? "hover:bg-violet-500/10 text-gray-200"
                              : "hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="w-9 h-9 rounded-md flex items-center justify-center bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                            <Settings className="w-4 h-4" />
                          </span>
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            onNavigate("my-profile");
                            setIsDropdownOpen(false);
                            setTimeout(() => {
                              document.getElementById('past-hackathons')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === "dark"
                              ? "hover:bg-violet-500/10 text-gray-200"
                              : "hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="w-9 h-9 rounded-md flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-600">
                            <Trophy className="w-4 h-4" />
                          </span>
                          My Hackathons
                        </button>
                      </div>

                      <div
                        className={`px-3 py-3 border-t ${theme === "dark" ? "border-violet-500/10" : "border-slate-300/50"}`}
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
