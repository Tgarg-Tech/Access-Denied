# Hackmate Server

Lightweight Express backend for fetching live hackathons from Unstop via Apify.

**Current scope:** Frontend-only architecture with Firestore in test mode

- Backend: Only serves `/api/hackathons` from Apify
- Frontend: All Firestore writes (profiles, teams, matching) are client-side

## Architecture

- **Frontend** writes directly to Firestore (test mode allows it)
- **Backend** fetches/caches hackathons from Apify and serves via REST
- **No Firebase Admin credentials needed** (for now)

## Quick Start

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Start the server

```bash
npm start
# Server listening on http://localhost:4000
```

**For development** (auto-reload on file changes):

```bash
npm install -g nodemon
npm run dev
```

## API Endpoints

#### Public (no authentication)

- `GET /api/hackathons` - List all hackathons from Apify/Unstop
- `GET /api/hackathons/:id` - Get single hackathon by ID

Example:

```bash
curl http://localhost:4000/api/hackathons
```

## Frontend Integration

Frontend calls `fetchHackathons()` from `src/api.js`, which hits `/api/hackathons`.

**All other operations** (profiles, teams, matching) use **Firestore client SDK** directly on frontend.

## Apify Integration

- **API**: `https://apify.com/trusted_offshoot/unstop-hackathon-scraper/api/javascript`
- **Token**: `APIFY_TOKEN` in `server/.env`
- **Cache**: Results cached for 2 hours to avoid rate limits
- **Fallback**: Returns stale cache if Apify API is down

## Troubleshooting

**"Apify API returned status 401"**

- Verify `APIFY_TOKEN` is correct in `server/.env`

**"Cannot find module"**

- Run `npm install` in the `server` folder

## Future: Adding Server-Side Validation

When ready to move authenticated operations to backend:

1. Uncomment Firebase Admin setup in `firebaseAdmin.js`
2. Add profiles, teams, match routes back
3. Set `GOOGLE_APPLICATION_CREDENTIALS` or Firebase env vars
4. Update frontend API calls to use backend endpoints instead of Firestore client

For now, keep it simple: backend = hackathons only, frontend = everything else.
