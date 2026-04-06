import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, MapPin, Clock, Target, Award, CheckCircle, ArrowLeft } from 'lucide-react';

interface HackathonDetailsProps {
  hackathonId: string;
  onNavigate: (page: string) => void;
}

const hackathonData: Record<string, any> = {
  '1': {
    title: 'TechCrunch Disrupt 2024',
    tagline: 'Build the Future of Technology',
    banner: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600',
    status: 'Active',
    prize: '$100,000',
    date: 'May 15-17, 2024',
    teamSize: '2-4 members',
    location: 'San Francisco, CA',
    theme: 'Artificial Intelligence & Automation',
    about: 'Join us for the most anticipated tech hackathon of the year. TechCrunch Disrupt brings together the brightest minds to solve real-world problems using cutting-edge technology. This is your chance to showcase your skills, network with industry leaders, and compete for substantial prizes.',
    eligibility: [
      'Must be 18 years or older',
      'Students and professionals welcome',
      'Team must be formed before event start',
      'Previous hackathon experience not required',
    ],
    rules: [
      'All code must be written during the hackathon',
      'Open source tools and frameworks are allowed',
      'Teams must submit their project by the deadline',
      'Projects must align with the given theme',
      'Respect code of conduct at all times',
    ],
    dates: [
      { label: 'Registration Deadline', date: 'May 10, 2024' },
      { label: 'Team Formation', date: 'May 11-14, 2024' },
      { label: 'Hackathon Kickoff', date: 'May 15, 2024 9:00 AM' },
      { label: 'Submission Deadline', date: 'May 17, 2024 6:00 PM' },
      { label: 'Winner Announcement', date: 'May 17, 2024 8:00 PM' },
    ],
    prizes: [
      { place: '1st Place', amount: '$50,000', description: 'Grand Prize + Mentorship' },
      { place: '2nd Place', amount: '$30,000', description: 'Runner Up Prize' },
      { place: '3rd Place', amount: '$20,000', description: 'Third Place Prize' },
      { place: 'Special Categories', amount: 'Various', description: 'Best Innovation, Best Design, etc.' },
    ],
  },
};

export function HackathonDetails({ hackathonId, onNavigate }: HackathonDetailsProps) {
  const hackathon = hackathonData[hackathonId] || hackathonData['1'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2 text-[#64748B] dark:text-[#94A3B8] hover:text-violet-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Hackathons</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 shadow-xl mb-8"
        >
          <div className="relative h-80 overflow-hidden">
            <img
              src={hackathon.banner}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold">
                  {hackathon.status}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-violet-500 text-white text-sm font-semibold">
                  {hackathon.theme}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {hackathon.title}
              </h1>
              <p className="text-xl text-white/90">{hackathon.tagline}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <DollarSign className="w-8 h-8 text-violet-500 mb-3" />
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Prize Pool</div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {hackathon.prize}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Team Size</div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {hackathon.teamSize}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <Calendar className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Duration</div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">3 Days</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Compete?</h2>
          <p className="text-white/90 mb-6">
            Join the hackathon and start finding your perfect team
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('matching')}
            className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            Find Teammates
          </motion.button>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center">
              <Target className="w-6 h-6 mr-3 text-violet-500" />
              About
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              {hackathon.about}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-violet-500" />
              Important Dates
            </h2>
            <div className="space-y-4">
              {hackathon.dates.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                >
                  <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                    {item.label}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{item.date}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-violet-500" />
              Prize Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {hackathon.prizes.map((prize: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                >
                  <div className="text-violet-500 font-semibold mb-1">{prize.place}</div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                    {prize.amount}
                  </div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    {prize.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6">
              Eligibility
            </h2>
            <ul className="space-y-3">
              {hackathon.eligibility.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6">
              Rules
            </h2>
            <ul className="space-y-3">
              {hackathon.rules.map((rule: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-sm font-semibold text-violet-500">{index + 1}</span>
                  </div>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{rule}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
