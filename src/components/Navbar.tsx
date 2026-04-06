import { useState } from "react";
import { Moon, Sun, Users, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToId = (id: string) => {
    try {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        onNavigate("landing");
      }
    } catch (e) {
      onNavigate("landing");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#F8FAFC]/70 dark:bg-[#0B1020]/70 backdrop-blur-md border-b border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center space-x-2 group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              DevSath
            </span>
          </button>

          <div className="flex items-center space-x-6">
            {currentPage === "landing" && (
              <>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Hackathons
                </button>
                <button
                  onClick={() => scrollToId("how-it-works")}
                  className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToId("features")}
                  className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Features
                </button>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 hover:border-violet-500 dark:hover:border-violet-500 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-[#F8FAFC]" />
              ) : (
                <Moon className="w-5 h-5 text-[#0F172A]" />
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
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === "my-profile" || isDropdownOpen
                    ? "bg-violet-500 border-violet-500 text-white"
                    : "bg-white dark:bg-[#121A2B] border-black/10 dark:border-white/10 hover:border-violet-500 dark:hover:border-violet-500 text-[#0F172A] dark:text-[#F8FAFC]"
                }`}
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </motion.button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                  >
                    <button
                      onClick={() => {
                        onNavigate("my-profile");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#0B1020] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("landing");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
