import { Moon, Sun, Users, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate("landing")}
                className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
              >
                Hackathons
              </button>
              <button
                onClick={() => {
                  if (currentPage !== "landing") {
                    onNavigate("landing");
                    setTimeout(() => {
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  } else {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
              >
                How It Works
              </button>
            </div>

            <div className="flex items-center space-x-4 ml-6">
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

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 hover:border-violet-500 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#121A2B] rounded-xl border border-black/10 dark:border-white/10 shadow-xl"
                  >
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate("profile");
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-[#0F172A] dark:text-[#F8FAFC] hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      My Profile
                    </button>
                    <div className="h-px bg-black/10 dark:bg-white/10 my-1"></div>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        console.log("Logout clicked");
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
        </div>
      </div>
    </motion.nav>
  );
}
