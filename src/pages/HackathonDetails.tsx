import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Target,
  Award,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { fetchHackathonById } from "../api";

interface HackathonDetailsProps {
  hackathonId: string;
  onNavigate: (page: string) => void;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600";

export function HackathonDetails({
  hackathonId,
  onNavigate,
}: HackathonDetailsProps) {
  const [hackathon, setHackathon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchHackathonById(hackathonId);
      setHackathon(data);
      setIsLoading(false);
    };
    load();
  }, [hackathonId]);

  const importantDates = useMemo(() => {
    if (!hackathon) return [];

    if (Array.isArray(hackathon.dates) && hackathon.dates.length > 0) {
      return hackathon.dates
        .filter((item: any) => item?.label && item?.date)
        .map((item: any) => ({
          label: `${item.label}`.trim(),
          date: `${item.date}`.trim(),
        }));
    }

    const rows = [
      { label: "Registration Deadline", date: hackathon.registrationDeadline },
      { label: "Start Date", date: hackathon.startDate },
      { label: "End Date", date: hackathon.endDate },
      { label: "Date / Timeline", date: hackathon.date },
    ].filter((item) => item.date && `${item.date}`.trim() !== "");

    return rows;
  }, [hackathon]);

  const prizeBreakdown = useMemo(() => {
    if (!hackathon) return [];
    if (!Array.isArray(hackathon.prizes) || hackathon.prizes.length === 0)
      return [];

    return hackathon.prizes
      .filter((item: any) => item?.place || item?.amount || item?.description)
      .map((item: any) => ({
        place: item?.place ? `${item.place}`.trim() : "Prize",
        amount: item?.amount ? `${item.amount}`.trim() : "TBA",
        description: item?.description ? `${item.description}`.trim() : "",
      }));
  }, [hackathon]);

  const eligibility = useMemo(() => {
    if (
      !hackathon?.eligibility ||
      !Array.isArray(hackathon.eligibility) ||
      hackathon.eligibility.length === 0
    ) {
      return ["Open to all eligible participants on Unstop."];
    }
    return hackathon.eligibility;
  }, [hackathon]);

  const rules = useMemo(() => {
    if (
      !hackathon?.rules ||
      !Array.isArray(hackathon.rules) ||
      hackathon.rules.length === 0
    ) {
      return ["Please check the official Unstop page for complete rules."];
    }
    return hackathon.rules;
  }, [hackathon]);

  const officialUrl = hackathon?.link || hackathon?.url || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-200 border-t-violet-500 rounded-full"
        />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center space-x-2 text-[#64748B] dark:text-[#94A3B8] hover:text-violet-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Hackathons</span>
          </button>
          <div className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10">
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              Hackathon details could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => onNavigate("dashboard")}
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
              src={hackathon.image || FALLBACK_IMAGE}
              alt={hackathon.title}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold">
                  {hackathon.status || "Active"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-violet-500 text-white text-sm font-semibold">
                  {hackathon.theme || "General"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">
                  {hackathon.mode || "Online"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {hackathon.title}
              </h1>
              <p className="text-xl text-white/90">
                {hackathon.tagline || "Build and compete with top innovators"}
              </p>
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
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">
              Prize
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {hackathon.prize || "Prize TBD"}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">
              Team Size
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {hackathon.teamSize || "As per rules"}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
          >
            <MapPin className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">
              Location
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {hackathon.city || "Online"}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Apply?
          </h2>
          <p className="text-white/90 mb-6">
            Visit the official page and continue with your team formation.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (officialUrl) {
                window.open(officialUrl, "_blank", "noopener,noreferrer");
              } else {
                onNavigate("matching");
              }
            }}
            className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            {officialUrl ? "Open on Unstop" : "Find Teammates"}
            {officialUrl ? <ExternalLink className="w-5 h-5" /> : null}
          </motion.button>
        </motion.div>

        <div className="space-y-8">
          {prizeBreakdown.length > 0 ? (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
            >
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-violet-500" />
                Prize Breakdown
              </h2>
              <div className="space-y-3">
                {prizeBreakdown.map((item: any, index: number) => (
                  <div
                    key={`${item.place}-${item.amount}-${index}`}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        {item.place}
                      </span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400">
                        {item.amount}
                      </span>
                    </div>
                    {item.description ? (
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

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
              {hackathon.about ||
                hackathon.description ||
                "Details are available on the official event page."}
            </p>

            {hackathon.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {hackathon.tags.slice(0, 12).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
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
            {importantDates.length > 0 ? (
              <div className="space-y-4">
                {importantDates.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex justify-between items-center p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1020] border border-black/5 dark:border-white/5"
                  >
                    <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                      {item.label}
                    </span>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                No structured timeline was provided by the source.
              </p>
            )}
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
              {eligibility.map((item: string, index: number) => (
                <li key={`${item}-${index}`} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    {item}
                  </span>
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
              {rules.map((rule: string, index: number) => (
                <li key={`${rule}-${index}`} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-sm font-semibold text-violet-500">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {officialUrl ? (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="p-8 rounded-2xl bg-white dark:bg-[#121A2B] border border-black/10 dark:border-white/10"
            >
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-violet-500" />
                Official Link
              </h2>
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 dark:text-violet-400 hover:underline break-all inline-flex items-center gap-2"
              >
                {officialUrl}
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
