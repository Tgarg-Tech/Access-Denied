const { ApifyClient } = require("apify-client");

const APIFY_TOKEN = process.env.VITE_APIFY_TOKEN || process.env.APIFY_TOKEN;
const APIFY_ACTOR_ID =
  process.env.APIFY_ACTOR_ID || "trusted_offshoot/unstop-hackathon-scraper";

// Simple in-memory cache with TTL
let cachedHackathons = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const DETAIL_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const detailCache = new Map();

function pickFirst(item, keys, fallback = "") {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      return value;
    }
  }
  return fallback;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((v) => `${v}`.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  if (typeof value === "string") {
    return value
      .split(/,|\||\/|•/)
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  return [];
}

function extractFromRegex(text, patterns, fallback = "") {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = `${match[1]}`.replace(/\s+/g, " ").trim();
      if (value) return value;
    }
  }
  return fallback;
}

function parseIndianAmountToken(token) {
  if (!token) return null;
  const normalized = `${token}`.toLowerCase().replace(/,/g, "").trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lac|k)?/i);
  if (!match?.[1]) return null;

  let amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const unit = (match[2] || "").toLowerCase();
  if (unit === "crore" || unit === "cr") amount *= 10000000;
  else if (unit === "lakh" || unit === "lac") amount *= 100000;
  else if (unit === "k") amount *= 1000;

  return Math.round(amount);
}

function extractPrizeFromText(detailsText) {
  if (!detailsText) return "Prize TBD";

  const direct = extractFromRegex(detailsText, [
    /(?:Prize\s*Pool|Prize|Rewards?)\s*:?\s*(₹\s*[\d,\.]+\s*(?:crore|cr|lakh|lac|k)?|\$\s*[\d,\.]+\s*(?:k|m)?|INR\s*[\d,\.]+\s*(?:crore|cr|lakh|lac|k)?)/i,
    /(₹\s*[\d,\.]+\s*(?:crore|cr|lakh|lac|k)?|\$\s*[\d,\.]+\s*(?:k|m)?|INR\s*[\d,\.]+\s*(?:crore|cr|lakh|lac|k)?)\s*(?:prize\s*pool|prize|rewards?)/i,
  ]);
  if (direct) return direct.replace(/\s+/g, " ").trim();

  const indiaUnitNearPrize = detailsText.match(
    /(\d+(?:\.\d+)?\s*(?:crore|cr|lakh|lac|k))\s*(?:prize\s*pool|prize|rewards?)/i,
  );
  if (indiaUnitNearPrize?.[1]) {
    const amount = parseIndianAmountToken(indiaUnitNearPrize[1]);
    if (amount) return formatPrize(amount);
  }

  return "Prize TBD";
}

function idFromLink(link, fallbackIndex) {
  if (!link) return `unstop-${fallbackIndex}`;
  try {
    const parsed = new URL(link);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "";
    if (last) return `unstop-${last}`;
  } catch {
    // no-op
  }
  return `unstop-${fallbackIndex}`;
}

function competitionIdFromLink(link) {
  if (!link) return null;
  const match = `${link}`.match(/-(\d+)(?:\?.*)?$/);
  return match?.[1] || null;
}

function stripHtml(html) {
  return `${html || ""}`
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMoneyValue(value) {
  if (typeof value === "number" && value > 0) return value;
  if (!value) return null;

  const text = `${value}`.trim();
  if (!text) return null;

  const match = text.match(/(\d{1,3}(?:,\d{3})+|\d+)/);
  if (!match?.[1]) return null;

  const amount = Number.parseInt(match[1].replace(/,/g, ""), 10);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function formatPrize(amount) {
  if (!amount) return "Prize TBD";
  if (typeof amount === "number")
    return `INR ${amount.toLocaleString("en-IN")}`;

  const text = `${amount}`.trim();
  if (!text || text === "$0" || text.toLowerCase() === "prize tbd")
    return "Prize TBD";
  return text;
}

function extractDate(value) {
  if (!value) return "TBA";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed && trimmed.toLowerCase() !== "tba") {
      const parsed = Date.parse(trimmed);
      if (!Number.isNaN(parsed)) {
        return new Date(parsed).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return trimmed;
    }
  }

  const parsed = Date.parse(`${value}`);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return "TBA";
}

function extractTeamSize(value) {
  if (!value) return "TBA";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }

  if (typeof value === "number") {
    return value > 0 ? `Up to ${value} members` : "TBA";
  }

  if (typeof value === "object") {
    const min = value.min || value.minTeamSize || value.minimum;
    const max = value.max || value.maxTeamSize || value.maximum;
    if (min && max) return `${min}-${max} members`;
    if (max) return `Up to ${max} members`;
    if (min) return `${min}+ members`;
  }

  return "TBA";
}

function formatDateRange(startDate, endDate, fallback = "Date TBD") {
  const start = Date.parse(startDate || "");
  const end = Date.parse(endDate || "");
  if (Number.isNaN(start) && Number.isNaN(end)) return fallback;

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (!Number.isNaN(start) && !Number.isNaN(end)) {
    return `${fmt(start)} - ${fmt(end)}`;
  }
  if (!Number.isNaN(start)) return fmt(start);
  return fmt(end);
}

function detectTheme(text) {
  const lower = text.toLowerCase();
  if (lower.includes("ai") || lower.includes("ml")) return "AI/ML";
  if (lower.includes("web3") || lower.includes("blockchain")) return "Web3";
  if (lower.includes("fintech") || lower.includes("finance")) return "FinTech";
  if (lower.includes("health") || lower.includes("bio")) return "HealthTech";
  if (lower.includes("robot") || lower.includes("iot")) return "Robotics/IoT";
  return "General";
}

async function fetchUnstopDetails(link) {
  if (!link) return {};

  const cached = detailCache.get(link);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  try {
    const competitionId = competitionIdFromLink(link);
    if (!competitionId) return {};

    const apiUrl = `https://unstop.com/api/public/competition/${competitionId}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      },
    });
    if (!response.ok) return {};

    const payload = await response.json();
    const comp = payload?.data?.competition;
    if (!comp) return {};

    const detailsText = stripHtml(comp.details || "");
    const derivedPrize = extractPrizeFromText(detailsText);

    const teamMin = Number(comp?.teams?.min || 0);
    const teamMax = Number(comp?.teams?.max || 0);
    const teamSize =
      teamMin > 0 && teamMax > 0
        ? `${teamMin}-${teamMax} members`
        : teamMax > 0
          ? `Up to ${teamMax} members`
          : "2-5 members";

    const city =
      comp?.location ||
      (Array.isArray(comp?.locations) && comp.locations[0]?.name) ||
      (comp?.subtype?.toLowerCase().includes("online") ? "Online" : "Offline");

    const mode = comp?.subtype?.toLowerCase().includes("online")
      ? "Online"
      : comp?.subtype?.toLowerCase().includes("offline")
        ? "Offline"
        : city?.toLowerCase?.().includes("online")
          ? "Online"
          : "Offline";

    const parsedStart = extractDate(comp.start_date);
    const parsedEnd = extractDate(comp.end_date);
    const dates = [];
    if (parsedStart !== "TBA")
      dates.push({ label: "Start Date", date: parsedStart });
    if (parsedEnd !== "TBA") dates.push({ label: "End Date", date: parsedEnd });

    const details = {
      image: comp.banner || comp.logoUrl || "",
      description:
        detailsText || stripHtml(comp?.seo_details?.meta_description || ""),
      about: detailsText,
      date: formatDateRange(comp.start_date, comp.end_date),
      startDate: comp.start_date || "",
      endDate: comp.end_date || "",
      registrationDeadline: comp.end_date || "",
      prize: derivedPrize,
      teamSize,
      organization: comp?.organisation?.name || "Unstop",
      city,
      mode,
      theme: detectTheme(`${comp.title || ""} ${detailsText}`),
      participants: Number(comp.registerCount || comp.players_count || 0),
      status: `${comp.listing_status || comp.status || ""}`
        .toUpperCase()
        .includes("LIVE")
        ? "Active"
        : `${comp.listing_status || comp.status || ""}`
              .toUpperCase()
              .includes("CLOSE")
          ? "Closed"
          : "Upcoming",
      link:
        comp.web_url ||
        (comp.public_url ? `https://unstop.com/${comp.public_url}` : link),
      tagline: comp.title || "",
      tags: normalizeList(comp.hashtags || comp.skills || []),
      eligibility: comp.regnRequirements
        ? [stripHtml(comp.regnRequirements)]
        : [],
      rules: detailsText ? [detailsText] : [],
      dates,
      prizes:
        derivedPrize && derivedPrize !== "Prize TBD"
          ? [
              {
                place: "Prize Pool",
                amount: derivedPrize,
                description: "As listed on Unstop",
              },
            ]
          : [],
      feeType: Number(comp.paid || 0) > 0 ? "Paid" : "Free",
      level: "National",
    };

    detailCache.set(link, {
      data: details,
      expiry: Date.now() + DETAIL_CACHE_TTL_MS,
    });

    return details;
  } catch {
    return {};
  }
}

function inferMode(item) {
  const explicitMode =
    `${pickFirst(item, ["mode", "eventMode", "participationMode"], "")}`.toLowerCase();
  if (explicitMode.includes("online")) return "Online";
  if (explicitMode.includes("offline")) return "Offline";
  if (explicitMode.includes("hybrid")) return "Hybrid";

  const location =
    `${pickFirst(item, ["location", "city", "venue"], "")}`.toLowerCase();
  if (!location) return "Online";
  if (
    location.includes("online") ||
    location.includes("remote") ||
    location.includes("virtual")
  ) {
    return "Online";
  }
  return "Offline";
}

function inferStatus(item) {
  const rawStatus =
    `${pickFirst(item, ["status", "hackathonStatus", "phase"], "")}`.toLowerCase();
  if (rawStatus.includes("upcoming")) return "Upcoming";
  if (rawStatus.includes("closed") || rawStatus.includes("ended"))
    return "Closed";
  if (
    rawStatus.includes("live") ||
    rawStatus.includes("active") ||
    rawStatus.includes("open")
  ) {
    return "Active";
  }

  const registrationText = `${pickFirst(item, ["registrationDeadline", "registrationEnd", "lastDate"], "")}`;
  const hasDate = Date.parse(registrationText);
  if (!Number.isNaN(hasDate) && hasDate < Date.now()) return "Closed";
  return "Active";
}

function inferFeeType(item) {
  const feeRaw =
    `${pickFirst(item, ["entryFee", "registrationFee", "fee"], "")}`.toLowerCase();
  if (!feeRaw) return "Free";
  if (feeRaw.includes("0") || feeRaw.includes("free") || feeRaw.includes("nil"))
    return "Free";
  return "Paid";
}

function isMeaningful(value, placeholders = ["", "TBA", "Prize TBD"]) {
  if (value === null || value === undefined) return false;
  const text = `${value}`.trim();
  if (!text) return false;
  return !placeholders.some((p) => text.toLowerCase() === `${p}`.toLowerCase());
}

function normalizeImageUrl(value) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("data:image/svg+xml") ||
    lower.includes("placeholder") ||
    lower.includes("loading")
  ) {
    return "";
  }

  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("www.")) return `https://${trimmed}`;
  if (trimmed.startsWith("/")) return `https://unstop.com${trimmed}`;
  return trimmed;
}

function normalizeItem(item, index) {
  const title =
    item.title ||
    item.name ||
    item.hackathonName ||
    item.eventName ||
    "Untitled Hackathon";
  const url =
    item.url ||
    item.link ||
    item.website ||
    item.registerUrl ||
    item.applyUrl ||
    "";

  let prize = "Prize TBD";
  const prizeSources = [
    item.prize,
    item.prizePool,
    item.totalPrize,
    item.pricePool,
    item.reward,
    item.prizeAmount,
    item.prizeMoney,
    item.rewardAmount,
    item.prizeValue,
    item.award,
    item.awardAmount,
    item.cashPrize,
    item.totalReward,
    item.maxPrize,
    item.totalCash,
    item.totalPrizePool,
    item.poolAmount,
    item.prizePoolAmount,
  ];

  for (const source of prizeSources) {
    if (!source) continue;
    if (typeof source === "number" && source > 0) {
      prize = formatPrize(source);
      break;
    }

    if (typeof source === "string" && source.trim()) {
      const amount = extractMoneyValue(source);
      if (amount) {
        prize = formatPrize(amount);
      } else {
        prize = formatPrize(source);
      }
      break;
    }
  }

  if (
    prize === "Prize TBD" &&
    Array.isArray(item.prizes) &&
    item.prizes.length > 0
  ) {
    let totalAmount = 0;
    for (const p of item.prizes) {
      const source =
        typeof p === "object"
          ? p.amount || p.value || p.prize || p.total || p.reward
          : p;
      const amount = extractMoneyValue(source);
      if (amount) totalAmount += amount;
    }
    if (totalAmount > 0) prize = formatPrize(totalAmount);
  }

  const dateSources = [
    item.date,
    item.eventDate,
    item.hackathonDate,
    item.startDate,
    item.registrationDeadline,
    item.deadline,
    item.closingDate,
    item.submissionDeadline,
    item.applicationDeadline,
    item.registrationStart,
    item.endDate,
    item.eventStartDate,
    item.hackathonStartDate,
    item.launchDate,
    item.openingDate,
  ];

  let date = "TBA";
  for (const source of dateSources) {
    const extracted = extractDate(source);
    if (extracted !== "TBA") {
      date = extracted;
      break;
    }
  }

  if (date === "TBA") {
    const start = extractDate(item.startDate);
    const end = extractDate(item.endDate);
    if (start !== "TBA" && end !== "TBA") date = `${start} - ${end}`;
    else if (start !== "TBA") date = `Starts: ${start}`;
    else if (end !== "TBA") date = `Ends: ${end}`;
  }

  const teamSizeValue =
    item.teamSize ||
    item.teamSizeText ||
    item.maxTeamSize ||
    item.teamLimit ||
    item.minTeamSize ||
    item.teamRequirements ||
    item.teamSizeRange ||
    item.groupSize ||
    item.maxGroupSize ||
    null;

  const teamSize = extractTeamSize(teamSizeValue);

  const participants = Number(
    item.participants ??
      item.attendees ??
      item.registeredUsers ??
      item.totalParticipants ??
      item.participantCount ??
      item.registrations ??
      item.participationCount ??
      0,
  );

  const imageCandidates = [
    item.image,
    item.imageUrl,
    item.image_url,
    item.banner,
    item.bannerUrl,
    item.banner_url,
    item.cover?.url,
    item.cover,
    item.coverImage,
    item.headerImage,
    item.featureImage,
    item.thumbnail,
    item.thumbnailUrl,
    item.poster,
    item.posterUrl,
    item.photo,
    item.photoUrl,
    item.logo,
    item.logoUrl,
    item.icon,
    item.hero,
    item.heroImage,
    item.ogImage,
    item.pictureUrl,
    item.pictureImage,
    item.eventImage,
    item.eventBanner,
    item.hackathonImage,
    item.hackathonBanner,
    item.mainImage,
    item.heroImageUrl,
    item.backgroundImage,
  ];

  const normalizedImageCandidates = imageCandidates
    .map(normalizeImageUrl)
    .filter(Boolean);

  const isValidImageUrl = (value) =>
    typeof value === "string" &&
    value.trim().length > 10 &&
    !value.startsWith("data:image/svg+xml") &&
    !value.toLowerCase().includes("placeholder") &&
    !value.toLowerCase().includes("loading") &&
    (value.includes("http") ||
      value.includes(".png") ||
      value.includes(".jpg") ||
      value.includes(".jpeg") ||
      value.includes(".webp"));

  const city =
    item.city ||
    item.location?.city ||
    item.location?.name ||
    item.location ||
    "Remote";
  const theme =
    item.theme ||
    item.category ||
    item.track ||
    item.hackathonTheme ||
    "General";
  const level =
    item.level || item.type || item.scope || item.difficulty || "Global";
  const organization =
    item.organization || item.host || item.brand || item.organizer || "Unstop";

  return {
    id: item.id || item._id || idFromLink(url, index),
    title,
    status: item.status || item.statusText || "Active",
    prize,
    date,
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    registrationDeadline: item.registrationDeadline || item.deadline || "",
    teamSize,
    participants: Number.isFinite(participants) ? participants : 0,
    image:
      normalizedImageCandidates.find(isValidImageUrl) ||
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
    city,
    mode: inferMode(item),
    theme,
    level,
    organization,
    feeType: inferFeeType(item),
    description: pickFirst(
      item,
      ["description", "about", "summary", "overview"],
      "",
    ),
    about: pickFirst(item, ["about", "description", "summary"], ""),
    link: url,
    url,
    eligibility: normalizeList(
      item.eligibility ||
        item.eligibilityCriteria ||
        item.whoCanParticipate ||
        [],
    ),
    rules: normalizeList(item.rules || item.terms || item.guidelines || []),
    tags: normalizeList(
      item.tags || item.skills || item.domains || item.techStack || [],
    ),
    tagline: pickFirst(
      item,
      ["tagline", "shortDescription"],
      `${theme} Hackathon`,
    ),
    dates: Array.isArray(item.dates) ? item.dates : [],
    prizes: Array.isArray(item.prizes) ? item.prizes : [],
  };
}

async function fetchHackathonsFromApify() {
  // Check cache
  if (cachedHackathons && Date.now() < cacheExpiry) {
    console.log("Serving hackathons from cache");
    return cachedHackathons;
  }

  if (!APIFY_TOKEN) {
    console.warn("APIFY_TOKEN not set, returning empty hackathons");
    return [];
  }

  try {
    const client = new ApifyClient({ token: APIFY_TOKEN });

    const input = {
      startUrls: [{ url: "https://unstop.com/hackathons" }],
      proxyConfiguration: { useApifyProxy: true },
    };

    console.log(`Running Apify actor: ${APIFY_ACTOR_ID}`);
    const run = await client.actor(APIFY_ACTOR_ID).call(input);

    if (!run || !run.defaultDatasetId) {
      console.error("Apify run did not return a default dataset ID");
      return [];
    }

    const { items = [] } = await client
      .dataset(run.defaultDatasetId)
      .listItems({ clean: true });

    console.log(`Found ${items.length} items from Apify dataset`);

    const baseHackathons = items
      .map((item, i) => ({
        ...normalizeItem(item, i),
        status: inferStatus(item),
      }))
      .filter((h) => h.title);

    const hackathons = await Promise.all(
      baseHackathons.map(async (hackathon) => {
        const detail = await fetchUnstopDetails(hackathon.link);
        return {
          ...hackathon,
          ...detail,
          link: detail.link || hackathon.link || hackathon.url,
          image: normalizeImageUrl(detail.image) || hackathon.image,
          prize: isMeaningful(detail.prize, ["", "TBA", "Prize TBD", "$0"])
            ? detail.prize
            : hackathon.prize,
          date: isMeaningful(detail.date, ["", "TBA", "Date TBD"])
            ? detail.date
            : hackathon.date,
          registrationDeadline: isMeaningful(detail.registrationDeadline, [
            "",
            "TBA",
          ])
            ? detail.registrationDeadline
            : hackathon.registrationDeadline,
          teamSize: isMeaningful(detail.teamSize, ["", "TBA", "As per rules"])
            ? detail.teamSize
            : hackathon.teamSize,
          organization: isMeaningful(detail.organization, ["", "Unstop"])
            ? detail.organization
            : hackathon.organization,
          city: isMeaningful(detail.city, ["", "Remote"])
            ? detail.city
            : hackathon.city,
          mode: detail.mode || hackathon.mode,
          theme: detail.theme || hackathon.theme,
          level: detail.level || hackathon.level,
          description: detail.description || hackathon.description,
          about: detail.about || detail.description || hackathon.about,
          url: detail.link || hackathon.url,
          dates: detail.dates?.length ? detail.dates : hackathon.dates,
          prizes: detail.prizes?.length ? detail.prizes : hackathon.prizes,
          eligibility: detail.eligibility?.length
            ? detail.eligibility
            : hackathon.eligibility,
          rules: detail.rules?.length ? detail.rules : hackathon.rules,
        };
      }),
    );

    hackathons.sort((a, b) => {
      const aPrize = a.prize && a.prize !== "Prize TBD" ? 1 : 0;
      const bPrize = b.prize && b.prize !== "Prize TBD" ? 1 : 0;
      if (aPrize !== bPrize) return bPrize - aPrize;

      const aDate = a.date && a.date !== "TBA" ? 1 : 0;
      const bDate = b.date && b.date !== "TBA" ? 1 : 0;
      if (aDate !== bDate) return bDate - aDate;

      return (b.participants || 0) - (a.participants || 0);
    });

    // Cache the results
    cachedHackathons = hackathons;
    cacheExpiry = Date.now() + CACHE_TTL_MS;

    console.log(
      `Successfully fetched ${hackathons.length} hackathons from Apify`,
    );
    return hackathons;
  } catch (err) {
    console.error("Error fetching from Apify API:", err.message || err);
    // Return cached data if available, even if expired
    if (cachedHackathons) {
      console.log("Returning stale cache due to fetch error");
      return cachedHackathons;
    }
    return [];
  }
}

module.exports = { fetchHackathonsFromApify };
