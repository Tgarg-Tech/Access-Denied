import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  Target,
  Award,
  Building
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface HackathonDashboardProps {
  onNavigate: (page: string, hackathonId?: string) => void;
}

const hackathons = [
  {
    id: "1",
    title: "TechCrunch Disrupt 2024",
    status: "Active",
    prize: "$100,000",
    date: "May 15-17, 2024",
    teamSize: "2-4 members",
    participants: 1250,
    image:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "San Francisco",
    theme: "AI & Automation",
    level: "Global",
    organization: "TechCrunch"
  },
  {
    id: "2",
    title: "AI Innovation Challenge",
    status: "Active",
    prize: "$75,000",
    date: "May 20-22, 2024",
    teamSize: "3-5 members",
    participants: 980,
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "New York",
    theme: "Artificial Intelligence",
    level: "National",
    organization: "OpenAI"
  },
  {
    id: "3",
    title: "Web3 Builder Summit",
    status: "Upcoming",
    prize: "$50,000",
    date: "June 1-3, 2024",
    teamSize: "2-5 members",
    participants: 750,
    image:
      "https://images.pexels.com/photos/5474289/pexels-photo-5474289.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "Miami",
    theme: "Web3 & Blockchain",
    level: "National",
    organization: "Ethereum Foundation"
  },
  {
    id: "4",
    title: "Healthcare Innovation Hack",
    status: "Active",
    prize: "$60,000",
    date: "May 18-20, 2024",
    teamSize: "3-6 members",
    participants: 620,
    image:
      "https://images.pexels.com/photos/5989928/pexels-photo-5989928.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "Boston",
    theme: "Healthcare & Biotech",
    level: "University",
    organization: "MIT"
  },
  {
    id: "5",
    title: "Climate Tech Hackathon",
    status: "Upcoming",
    prize: "$80,000",
    date: "June 10-12, 2024",
    teamSize: "2-4 members",
    participants: 890,
    image:
      "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "Seattle",
    theme: "Environment & Climate",
    level: "National",
    organization: "GreenTech Foundation"
  },
  {
    id: "6",
    title: "FinTech Revolution 2024",
    status: "Upcoming",
    prize: "$120,000",
    date: "June 15-17, 2024",
    teamSize: "3-5 members",
    participants: 1100,
    image:
      "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
    city: "London",
    theme: "Finance & Fintech",
    level: "Global",
    organization: "FinTech Alliance"
  },
];

export function HackathonDashboard({ onNavigate }: HackathonDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cityFilter, setCityFilter] = useState("All");
  const [themeFilter, setThemeFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");

  useEffect(() => {
    const setNavHeight = () => {
      const nav = document.querySelector("nav");
      const navHeight = nav ? nav.getBoundingClientRect().height : 64;
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navHeight}px`,
      );
    };

    setNavHeight();
    window.addEventListener("resize", setNavHeight);
    return () => window.removeEventListener("resize", setNavHeight);
  }, []);

  // Derived unique options for advanced filters
  const cities = useMemo(() => ["All", ...Array.from(new Set(hackathons.map(h => h.city))).sort()], []);
  const themes = useMemo(() => ["All", ...Array.from(new Set(hackathons.map(h => h.theme))).sort()], []);
  const levels = useMemo(() => ["All", ...Array.from(new Set(hackathons.map(h => h.level))).sort()], []);
  const orgs = useMemo(() => ["All", ...Array.from(new Set(hackathons.map(h => h.organization))).sort()], []);

  const clearAdvancedFilters = () => {
    setCityFilter("All");
    setThemeFilter("All");
    setLevelFilter("All");
    setOrgFilter("All");
  };

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || h.status === statusFilter;
    const matchesCity = cityFilter === "All" || h.city === cityFilter;
    const matchesTheme = themeFilter === "All" || h.theme === themeFilter;
    const matchesLevel = levelFilter === "All" || h.level === levelFilter;
    const matchesOrg = orgFilter === "All" || h.organization === orgFilter;
    
    return matchesSearch && matchesStatus && matchesCity && matchesTheme && matchesLevel && matchesOrg;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24">
      <div
        id="hackathon-search-bar"
        className="relative z-40 bg-[#F8FAFC]/70 dark:bg-[#0B1020]/70 backdrop-blur-md border-b border-black/10 dark:border-white/10 py-6"
      >
        {" "}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#64748B] dark:placeholder-[#94A3B8] focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-2">
                {["All", "Active", "Upcoming"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      statusFilter === status
                        ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/20"
                        : "bg-white dark:bg-[#121A2B] text-[#64748B] dark:text-[#94A3B8] border border-black/10 dark:border-white/10 hover:border-violet-500"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border ${
                  showAdvanced || cityFilter !== "All" || themeFilter !== "All" || levelFilter !== "All" || orgFilter !== "All"
                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500"
                    : "bg-white dark:bg-[#121A2B] text-[#64748B] dark:text-[#94A3B8] border-black/10 dark:border-white/10 hover:border-violet-500"
                }`}
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* City Filter */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> City
                      </label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1.25em 1.25em"
                        }}
                      >
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>

                    {/* Theme Filter */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                        <Target className="w-4 h-4" /> Theme
                      </label>
                      <select
                        value={themeFilter}
                        onChange={(e) => setThemeFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1.25em 1.25em"
                        }}
                      >
                        {themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
                      </select>
                    </div>

                    {/* Level Filter */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                        <Award className="w-4 h-4" /> Level
                      </label>
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1.25em 1.25em"
                        }}
                      >
                        {levels.map(level => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </div>

                    {/* Organization Filter */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                        <Building className="w-4 h-4" /> Organization
                      </label>
                      <select
                        value={orgFilter}
                        onChange={(e) => setOrgFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1.25em 1.25em"
                        }}
                      >
                        {orgs.map(org => <option key={org} value={org}>{org}</option>)}
                      </select>
                    </div>
                  </div>

                  {(cityFilter !== "All" || themeFilter !== "All" || levelFilter !== "All" || orgFilter !== "All") && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-end mt-4"
                    >
                      <button
                        onClick={clearAdvancedFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            Discover Hackathons
          </h1>
          <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
            Find the perfect challenge and build your winning team
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hackathon.image}
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      hackathon.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {hackathon.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-4 group-hover:text-violet-500 transition-colors">
                  {hackathon.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-[#64748B] dark:text-[#94A3B8]">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-semibold text-violet-500">
                      {hackathon.prize}
                    </span>
                    <span className="ml-1">Prize Pool</span>
                  </div>
                  <div className="flex items-center text-sm text-[#64748B] dark:text-[#94A3B8]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {hackathon.date}
                  </div>
                  <div className="flex items-center text-sm text-[#64748B] dark:text-[#94A3B8]">
                    <Users className="w-4 h-4 mr-2" />
                    {hackathon.teamSize} • {hackathon.participants} participants
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => onNavigate("details", hackathon.id)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium hover:bg-violet-500/20 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHackathons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-[#64748B] dark:text-[#94A3B8]">
              No hackathons found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
