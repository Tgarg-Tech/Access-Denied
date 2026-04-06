import { Moon, Sun, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

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
                <button className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors">
                  How It Works
                </button>
                <button className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors">
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
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
