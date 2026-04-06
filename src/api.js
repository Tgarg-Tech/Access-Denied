import { auth } from "./firebase";

const HACKATHON_FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600";

function normalizeHackathonImageUrl(value) {
  if (typeof value !== "string") return HACKATHON_FALLBACK_IMAGE;

  const trimmed = value.trim();
  if (!trimmed) return HACKATHON_FALLBACK_IMAGE;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("data:image/svg+xml") ||
    lower.includes("placeholder") ||
    lower.includes("loading")
  ) {
    return HACKATHON_FALLBACK_IMAGE;
  }

  const normalized = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    return `${base}${normalized}`;
  }

  return HACKATHON_FALLBACK_IMAGE;
}

function normalizeHackathonPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item) => ({
      ...item,
      image: normalizeHackathonImageUrl(item?.image),
    }));
  }

  if (payload && typeof payload === "object") {
    return {
      ...payload,
      image: normalizeHackathonImageUrl(payload.image),
    };
  }

  return payload;
}

/**
 * Get Firebase ID token for authenticated API calls
 */
async function getAuthToken() {
  if (!auth?.currentUser) return null;
  return await auth.currentUser.getIdToken(true);
}

/**
 * Fetch hackathons from backend API
 */
export async function fetchHackathons() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/hackathons`,
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    const data = await response.json();
    return normalizeHackathonPayload(data);
  } catch (err) {
    console.error("Failed to fetch hackathons:", err);
    return [];
  }
}

/**
 * Fetch a single hackathon by ID
 */
export async function fetchHackathonById(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/hackathons/${id}`,
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    const data = await response.json();
    return normalizeHackathonPayload(data);
  } catch (err) {
    console.error("Failed to fetch hackathon:", err);
    return null;
  }
}

/**
 * Get user profile from backend (authenticated)
 */
export async function fetchProfile(uid) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/profiles/${uid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}

/**
 * Update user profile (authenticated)
 */
export async function updateProfile(uid, data) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/profiles/${uid}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to update profile:", err);
    return null;
  }
}

/**
 * Create a team (authenticated)
 */
export async function createTeam(hackathonId, name, members = []) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/teams`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hackathonId, name, members }),
      },
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to create team:", err);
    return null;
  }
}

/**
 * Get team by ID (authenticated)
 */
export async function fetchTeam(teamId) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/teams/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch team:", err);
    return null;
  }
}

/**
 * Compute matches for current user (authenticated)
 */
export async function computeMatches(uid) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api/match/${uid}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Failed to compute matches:", err);
    return { top: [] };
  }
}
