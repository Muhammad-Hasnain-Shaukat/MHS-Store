# MHS Store

A full e-commerce web app: React frontend, Node.js/Express backend, MongoDB database.

- Anyone can browse every product without an account.
- Login is required only for checkout and viewing order history/tracking.
- Includes an admin dashboard to add/edit/delete products and update order status.

```
mhs-store/
  server/   -> Node.js + Express + MongoDB API
  client/   -> React (Vite) frontend
```

---

## 1. Run it locally first

### Backend
```bash
cd server
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET (see step 2)
npm install
npm run seed               # loads sample products + creates an admin login
npm run dev                # starts API on http://localhost:5000
```
Seeded admin login: `admin@mhsstore.com` / `Admin@123` (change the password after first login in a real deployment — see step 4).

### Frontend
```bash
cd client
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # opens http://localhost:5173
```

---

## 2. Free database: MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster** (no credit card required).
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, click **Add IP Address** → **Allow access from anywhere** (0.0.0.0/0) — required so Vercel's servers can connect.
5. Click **Connect** → **Drivers** → copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Manually insert a database name into that string, right after `.net/` and before the `?` — e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mhsstore?retryWrites=true&w=majority`
7. Put that finished string in `server/.env` as `MONGO_URI` for local use, and save it — you'll paste it into Vercel in step 3.

---

## 3. Deploy everything to Vercel (frontend + backend, one platform, free, no card required)

This project is structured so Vercel builds the React frontend as a static site **and** runs the Node/Express backend as a serverless function (`api/index.js`), both from the same deployment — no second hosting platform needed.

1. Push this project to a GitHub repository (see step 5 below if you haven't already).
2. Go to https://vercel.com and sign up with GitHub.
3. Click **Add New** → **Project** → import your `mhs-store` repo.
4. **Important:** leave the **Root Directory** as the repo root (do **not** set it to `client` or `server`) — Vercel needs to see both folders plus `vercel.json` and `api/` at the top level.
5. Framework preset: Vercel should auto-detect via `vercel.json`. If it asks, choose **Other** — the build/output settings are already defined in `vercel.json`, so you can leave those fields blank/default.
6. Add environment variables:
   - `MONGO_URI` → your Atlas connection string (with `mhsstore` inserted, from step 2)
   - `JWT_SECRET` → any long random string, e.g. `mhsstore_super_secret_key_2026`
7. Click **Deploy**.

Vercel builds the client and deploys the API function together. You'll get one live URL, e.g. `https://mhs-store.vercel.app` — that's your entire store, frontend and backend both live at that same address (API reachable at `https://mhs-store.vercel.app/api/...`).

No `CLIENT_URL` variable is needed anymore since everything shares one domain — no cross-origin requests happen.

---

## 4. Seed your live database with products

Locally, temporarily point your `.env` at the **Atlas** `MONGO_URI` (the same one Render uses) and run:
```bash
cd server
npm run seed
```
This inserts the sample catalog and creates the admin account directly in your live database. Afterwards, log in as admin on your live site and change the admin password, or create a new admin manually in Atlas and demote/delete the seeded one.

---

## 5. Getting the project onto GitHub (if you haven't already)

```bash
cd mhs-store
git init
git add .
git commit -m "Initial commit: MHS Store"
git branch -M main
git remote add origin https://github.com/<your-username>/mhs-store.git
git push -u origin main
```
Create the empty repo first at https://github.com/new.

---

## Customizing

- **Products:** log in as admin at `/admin` on your live site, or edit `server/seed.js`.
- **Branding/colors:** all design tokens are at the top of `client/src/index.css`.
- **Store name:** currently "MHS Store" throughout — change `brand-word`/`brand-mark` in `Navbar.jsx` and the `<title>` in `client/index.html` if needed.

## Notes on "React Native"

You asked for React Native, but since this is a **website**, it's built with React (for web) + Vite, which is what deploys to a browser URL. If you also want a mobile app version later, the same backend API can power a React Native app — just ask and I can scaffold that separately.
