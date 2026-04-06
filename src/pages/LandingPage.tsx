import { motion } from "framer-motion";
import {
  Users,
  Zap,
  Shield,
  Target,
  ArrowRight,
  Sparkles,
  Trophy,
  Search,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description:
        "AI-powered algorithm matches you with teammates based on skills, interests, and compatibility.",
    },
    {
      icon: Shield,
      title: "Verified Skills",
      description:
        "Trust your team with skill verification through GitHub, portfolios, and certificates.",
    },
    {
      icon: Target,
      title: "Role-Based Search",
      description:
        "Find the perfect complement to your team with targeted role-based recommendations.",
    },
    {
      icon: Trophy,
      title: "Track Success",
      description:
        "Monitor team readiness scores and ensure you have all the skills needed to win.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Browse Hackathons",
      description:
        "Explore upcoming hackathons and find the perfect challenge for you.",
    },
    {
      number: "02",
      title: "Build Your Profile",
      description:
        "Showcase your skills, verify your expertise, and highlight your interests.",
    },
    {
      number: "03",
      title: "Get Matched",
      description:
        "Our algorithm connects you with compatible teammates who complement your skills.",
    },
    {
      number: "04",
      title: "Form Your Team",
      description:
        "Invite members, coordinate roles, and prepare to win together.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020]">
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                Find Your Perfect Team
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6 leading-tight">
              Win Hackathons with
              <br />
              <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                The Right Team
              </span>
            </h1>

            <p className="text-xl text-[#64748B] dark:text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed">
              HackMate uses intelligent matching to connect you with skilled
              teammates who share your goals. Build winning teams faster than
              ever.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("loading")}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-32"
          >
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10">
              <div className="text-4xl font-bold text-violet-500 mb-2">
                10K+
              </div>
              <div className="text-[#64748B] dark:text-[#94A3B8]">
                Active Developers
              </div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10">
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-[#64748B] dark:text-[#94A3B8]">
                Hackathons Listed
              </div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10">
              <div className="text-4xl font-bold text-violet-500 mb-2">95%</div>
              <div className="text-[#64748B] dark:text-[#94A3B8]">
                Match Success Rate
              </div>
            </div>
          </motion.div>

          <div
            id="how-it-works"
            className="mb-32"
            style={{ scrollMarginTop: "80px" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                How It Works
              </h2>
              <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
                Four simple steps to finding your dream team
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 hover:border-violet-500/50 transition-colors"
                >
                  <div className="text-6xl font-bold text-violet-500/10 dark:text-violet-500/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            id="features"
            className="mb-20"
            style={{ scrollMarginTop: "80px" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-[#64748B] dark:text-[#94A3B8]">
                Everything you need to build and manage winning teams
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Team?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of developers building winning teams on HackMate
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("loading")}
              className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Start Matching Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
