import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Target,
  ArrowRight,
  Sparkles,
  Trophy,
  Search,
  Rocket,
  CheckCircle2,
  Orbit,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const heroChips = [
    "AI Team Chemistry",
    "Role-fit Signals",
    "Portfolio Proof",
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description:
        "AI-powered algorithm matches you with teammates based on skills, interests, and compatibility.",
      accent: "bg-[#ff8a64]/90",
    },
    {
      icon: Shield,
      title: "Verified Skills",
      description:
        "Trust your team with skill verification through GitHub, portfolios, and certificates.",
      accent: "bg-[#5d8eff]/90",
    },
    {
      icon: Target,
      title: "Role-Based Search",
      description:
        "Find the perfect complement to your team with targeted role-based recommendations.",
      accent: "bg-[#8a67ff]/90",
    },
    {
      icon: Trophy,
      title: "Track Success",
      description:
        "Monitor team readiness scores and ensure you have all the skills needed to win.",
      accent: "bg-[#f98964]/90",
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
    <div className="relative min-h-screen overflow-hidden landing-mesh">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#ff8f6f]/20 blur-3xl pulse-glow" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#6280ff]/20 blur-3xl pulse-glow" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#35d9ff]/16 blur-3xl pulse-glow" />
        <div className="absolute right-[20%] top-[30%] h-44 w-44 rounded-full border border-white/30 dark:border-white/10" />
      </div>

      <div className="pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#5e64ff]" />
                <span className="text-sm font-semibold text-[#404ac7] dark:text-[#b7bdff]">
                  Find Your Perfect Team
                </span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6 leading-tight tracking-tight">
                Build a
                <br />
                <span className="text-[#4457d8] dark:text-[#b8c3ff]">
                  Winning Squad
                </span>
                <br />
                in Minutes
              </h1>

              <p className="text-lg md:text-xl text-[#4e5a7d] dark:text-[#b0b9dc] mb-8 max-w-2xl leading-relaxed">
                HackMate matches you with skilled builders that complement your
                stack, your pace, and your hackathon goal. Stop searching.
                Start shipping.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {heroChips.map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full text-sm font-medium glass-panel text-[#4e5b85] dark:text-[#c1caeb]"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate("loading")}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff7e4c] via-[#ff8f6f] to-[#5f73ff] shadow-xl shadow-[#5f73ff]/35 border border-white/30 hover:brightness-105 hover:shadow-2xl hover:shadow-[#5f73ff]/40 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <div className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full glass-panel text-[#42507d] dark:text-[#bdc6ea]">
                  <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                  <span>No team? We match in minutes.</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-[28px] bg-[#6f84ff]/20 blur-2xl" />
              <div className="relative rounded-[28px] glass-panel p-6 md:p-8 border-white/70 dark:border-white/15">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#56648f] dark:text-[#b8c2e4]">Live Team Readiness</p>
                    <p className="font-display text-3xl text-[#1f2b53] dark:text-white font-bold">
                      92%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl glass-panel-soft flex items-center justify-center">
                    <Orbit className="w-6 h-6 text-[#4f5ef2] dark:text-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="rounded-xl glass-panel-soft p-3 flex items-center justify-between">
                    <span className="text-sm text-[#495781] dark:text-[#c1caeb]">Frontend Engineer</span>
                    <span className="text-xs px-2 py-1 rounded-full glass-panel-soft text-emerald-600 dark:text-emerald-300">Matched</span>
                  </div>
                  <div className="rounded-xl glass-panel-soft p-3 flex items-center justify-between">
                    <span className="text-sm text-[#495781] dark:text-[#c1caeb]">ML Specialist</span>
                    <span className="text-xs px-2 py-1 rounded-full glass-panel-soft text-cyan-600 dark:text-cyan-300">Suggested</span>
                  </div>
                  <div className="rounded-xl glass-panel-soft p-3 flex items-center justify-between">
                    <span className="text-sm text-[#495781] dark:text-[#c1caeb]">Pitch Lead</span>
                    <span className="text-xs px-2 py-1 rounded-full glass-panel-soft text-violet-600 dark:text-violet-300">Open</span>
                  </div>
                </div>

                <div className="rounded-2xl p-4 glass-panel-soft text-[#2f3f73] dark:text-[#d0d9fb]">
                  <p className="text-sm opacity-80">Recommended next action</p>
                  <p className="font-semibold">Invite 2 top candidates to Team Orbit</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-32"
          >
            <div className="text-center p-8 rounded-2xl glass-panel shadow-lg shadow-[#6472ff]/10 gradient-border-card">
              <div className="font-display text-4xl font-bold text-[#6878ff] mb-2">
                10K+
              </div>
              <div className="text-[#5f6f97] dark:text-[#a8b4d8]">
                Active Developers
              </div>
            </div>
            <div className="text-center p-8 rounded-2xl glass-panel shadow-lg shadow-[#35d9ff]/10 gradient-border-card">
              <div className="font-display text-4xl font-bold text-[#3bbef8] mb-2">500+</div>
              <div className="text-[#5f6f97] dark:text-[#a8b4d8]">
                Hackathons Listed
              </div>
            </div>
            <div className="text-center p-8 rounded-2xl glass-panel shadow-lg shadow-[#ff8f6f]/10 gradient-border-card">
              <div className="font-display text-4xl font-bold text-[#ff8158] mb-2">95%</div>
              <div className="text-[#5f6f97] dark:text-[#a8b4d8]">
                Match Success Rate
              </div>
            </div>
          </motion.div>

          <div
            id="how-it-works"
            className="mb-32"
            style={{ scrollMarginTop: "80px" }}
          >
            <div className="ambient-line h-px mb-14" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-5">
                <span className="h-2 w-2 rounded-full bg-[#5f73ff]" />
                <span className="text-sm font-medium text-[#4b58aa] dark:text-[#b9c3ff]">Simple process, strong teams</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                How It Works
              </h2>
              <p className="text-lg text-[#5f6f97] dark:text-[#a8b4d8]">
                Four simple steps to finding your dream team
              </p>
            </motion.div>

            <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-8 h-px bg-gradient-to-r from-[#ff8f6f]/45 via-[#6277ff]/45 to-[#35d9ff]/45" />
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-7 rounded-2xl glass-panel gradient-border-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6472ff]/12"
                >
                  <div className="relative z-10 w-16 h-16 mb-5 rounded-2xl glass-panel-soft flex items-center justify-center border border-white/80 dark:border-white/15">
                    <span className="font-display text-2xl font-bold text-[#4b5eea] dark:text-[#c7d0ff]">
                      {step.number}
                    </span>
                  </div>
                  <div className="mb-3 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#5f73ff]/15 text-[#4a5bc9] dark:bg-[#5f73ff]/20 dark:text-[#c5ceff]">
                    STEP {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#5f6f97] dark:text-[#a8b4d8] leading-relaxed">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-5">
                <Sparkles className="w-4 h-4 text-[#5a67e8]" />
                <span className="text-sm font-medium text-[#4b58aa] dark:text-[#b9c3ff]">Built for fast-moving teams</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-[#5f6f97] dark:text-[#a8b4d8]">
                Everything you need to build and manage winning teams
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden p-8 rounded-2xl glass-panel hover:shadow-lg hover:shadow-[#6472ff]/15 transition-all gradient-border-card"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#6679ff]/12 blur-2xl" />
                    <div
                      className={`w-12 h-12 rounded-xl glass-panel-soft ${feature.accent} flex items-center justify-center mb-6 border border-white/40`}
                    >
                      <Icon className="w-6 h-6 text-[#14224d] dark:text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#5f6f97] dark:text-[#a8b4d8] leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4b5ce0] dark:text-[#c5ceff]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5f73ff]" />
                      <span>Optimized for hackathon velocity</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="glass-panel rounded-3xl p-7 md:p-8 mb-8 gradient-border-card">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#5f73ff]/15 text-[#4b5cd4] dark:bg-[#5f73ff]/20 dark:text-[#c6cfff]">
                  What You Unlock
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium glass-panel-soft text-[#52608a] dark:text-[#c2cceb]">
                  Better role coverage
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium glass-panel-soft text-[#52608a] dark:text-[#c2cceb]">
                  Faster team decisions
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium glass-panel-soft text-[#52608a] dark:text-[#c2cceb]">
                  Higher project momentum
                </span>
              </div>
              <p className="text-[#5f6f97] dark:text-[#a8b4d8] leading-relaxed">
                The platform combines profile quality, role balance, and collaboration signals so you can spend less time searching and more time building.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl glass-panel gradient-border-card hover:shadow-lg hover:shadow-[#ff8a64]/10 transition-all">
                <div className="w-11 h-11 rounded-lg glass-panel-soft bg-[#ff8a64]/70 border border-white/40 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-[#14224d] dark:text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#111c3e] dark:text-white mb-2">Chemistry-first Matching</h3>
                <p className="text-[#5f6f97] dark:text-[#a8b4d8]">Beyond skills, we score communication style and collaboration rhythm.</p>
              </div>
              <div className="p-6 rounded-2xl glass-panel gradient-border-card hover:shadow-lg hover:shadow-[#5f75ff]/10 transition-all">
                <div className="w-11 h-11 rounded-lg glass-panel-soft bg-[#5f75ff]/70 border border-white/40 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-[#14224d] dark:text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#111c3e] dark:text-white mb-2">Instant Team Drafts</h3>
                <p className="text-[#5f6f97] dark:text-[#a8b4d8]">Get ready-to-invite squads with balanced roles in one click.</p>
              </div>
              <div className="p-6 rounded-2xl glass-panel gradient-border-card hover:shadow-lg hover:shadow-[#8a67ff]/10 transition-all">
                <div className="w-11 h-11 rounded-lg glass-panel-soft bg-[#8a67ff]/70 border border-white/40 flex items-center justify-center mb-4">
                  <Rocket className="w-5 h-5 text-[#14224d] dark:text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#111c3e] dark:text-white mb-2">Launch-ready Tracking</h3>
                <p className="text-[#5f6f97] dark:text-[#a8b4d8]">Know team gaps early with role health and readiness signals.</p>
              </div>
            </div>
          </div>

          <div
            id="about"
            className="mb-32"
            style={{ scrollMarginTop: "80px" }}
          >
            <div className="ambient-line h-px mb-14" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
                About HackMate
              </h2>
              <p className="text-lg text-[#5f6f97] dark:text-[#a8b4d8] max-w-3xl mx-auto leading-relaxed">
                HackMate was built by a passionate team of developers who experienced the friction of hackathon team formation firsthand. Our platform leverages transparency, compatibility scoring, and verified skill proof to ensure that every participant finds their perfect squad. We believe that great chemistry leads to great products.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center gap-6"
            >
              <a href="https://twitter.com/hackmate" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors text-[#5f6f97] dark:text-[#a8b4d8]">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/hackmate" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-colors text-[#5f6f97] dark:text-[#a8b4d8]">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://github.com/hackmate" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel hover:bg-[#333]/10 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white transition-colors text-[#5f6f97] dark:text-[#a8b4d8]">
                <Github className="w-6 h-6" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl glass-panel border border-white/80 dark:border-white/15"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl glass-panel-soft bg-[#5f75ff]/70 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#14224d] dark:text-white" />
              </div>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14204b] dark:text-white mb-4">
              Ready to Find Your Team?
            </h2>
            <p className="text-[#4f5f8a] dark:text-[#b8c3e6] text-lg mb-8">
              Join thousands of developers building winning teams on HackMate
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("loading")}
              className="px-8 py-4 glass-panel-soft text-[#4454c3] dark:text-[#d5dcfb] font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Start Matching Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
