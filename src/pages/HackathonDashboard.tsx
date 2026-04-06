import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HackathonDashboardProps {
  onNavigate: (page: string, hackathonId?: string) => void;
}

const hackathons = [
  {
    id: '1',
    title: 'TechCrunch Disrupt 2024',
    status: 'Active',
    prize: '$100,000',
    date: 'May 15-17, 2024',
    teamSize: '2-4 members',
    participants: 1250,
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'AI Innovation Challenge',
    status: 'Active',
    prize: '$75,000',
    date: 'May 20-22, 2024',
    teamSize: '3-5 members',
    participants: 980,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Web3 Builder Summit',
    status: 'Upcoming',
    prize: '$50,000',
    date: 'June 1-3, 2024',
    teamSize: '2-5 members',
    participants: 750,
    image: 'https://images.pexels.com/photos/5474289/pexels-photo-5474289.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    title: 'Healthcare Innovation Hack',
    status: 'Active',
    prize: '$60,000',
    date: 'May 18-20, 2024',
    teamSize: '3-6 members',
    participants: 620,
    image: 'https://images.pexels.com/photos/5989928/pexels-photo-5989928.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    title: 'Climate Tech Hackathon',
    status: 'Upcoming',
    prize: '$80,000',
    date: 'June 10-12, 2024',
    teamSize: '2-4 members',
    participants: 890,
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    title: 'FinTech Revolution 2024',
    status: 'Upcoming',
    prize: '$120,000',
    date: 'June 15-17, 2024',
    teamSize: '3-5 members',
    participants: 1100,
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function HackathonDashboard({ onNavigate }: HackathonDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const setNavHeight = () => {
      const nav = document.querySelector('nav');
      const navHeight = nav ? nav.getBoundingClientRect().height : 64;
      document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
    };

    setNavHeight();
    window.addEventListener('resize', setNavHeight);
    return () => window.removeEventListener('resize', setNavHeight);
  }, []);

  const filteredHackathons = hackathons.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24">
<div id="hackathon-search-bar" className="relative z-40 bg-[#F8FAFC]/70 dark:bg-[#0B1020]/70 backdrop-blur-md border-b border-black/10 dark:border-white/10 py-6">        <div className="max-w-7xl mx-auto px-6">
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

            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
              <div className="flex gap-2">
                {['All', 'Active', 'Upcoming'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white'
                        : 'bg-white dark:bg-[#121A2B] text-[#64748B] dark:text-[#94A3B8] border border-black/10 dark:border-white/10 hover:border-violet-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
                      hackathon.status === 'Active'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
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
                  onClick={() => onNavigate('details', hackathon.id)}
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
