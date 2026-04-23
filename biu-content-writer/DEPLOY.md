# Deployment Guide — BIU Content Writer
### For non-technical users · ~30 minutes total

---

## What you are setting up

| What | Where | Cost |
|---|---|---|
| The AI pipeline (brain) | Railway | ~$5/month |
| The website (what you open) | Vercel | Free |
| The code | GitHub (private) | Free |

**You will need before starting:**
- Your **Anthropic API key** — get it at [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key. It looks like `sk-ant-api03-...`
- Access to the **barilanuniversitymarketing-rgb** GitHub organization

---

## Part 1 — Railway (the backend server)

Railway runs the AI agents, scrapes BIU's website, and stores your documents. Think of it as the engine room.

---

### Step 1 · Create a Railway account

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** in the top right
3. Click **"Login with GitHub"**
4. Authorize Railway when prompted
5. When asked about a plan, choose **"Hobby"** ($5/month) — the free tier is too limited for this app

---

### Step 2 · Create a new project

1. Once logged in, click the **"New Project"** button (top right)
2. Choose **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"** if this is your first time — this lets Railway read your repositories
4. Search for and select **`barilanuniversitymarketing-rgb/claudecode`**
5. Railway will ask which branch — choose **`claude/create-new-project-branch-Bl5hs`** (or `main` if the code has been merged)

---

### Step 3 · Set the root directory

Railway needs to know we only want to deploy the backend folder, not the whole repo.

1. After selecting the repo, Railway shows a service configuration screen
2. Find the **"Root Directory"** field
3. Type exactly: `biu-content-writer/backend`
4. Click **"Deploy"**

Railway will now build the Docker container. This takes **5–10 minutes** the first time (it installs a browser for web scraping). You will see a build log — this is normal.

---

### Step 4 · Add environment variables

While Railway builds, add your secrets.

1. Click on your service (the box that appeared in the project)
2. Click the **"Variables"** tab
3. Add the following variables one by one by clicking **"New Variable"**:

| Variable name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your key from Anthropic (e.g. `sk-ant-api03-...`) |
| `DATABASE_URL` | `sqlite:////data/biu_content.db` ← copy exactly, 4 slashes |
| `DOCS_DIR` | `/data/docs` |

4. Click **"Deploy"** after adding all three — this restarts the service with the new variables

---

### Step 5 · Add persistent storage (important!)

Without this step, all generated documents and data will be lost every time the server restarts.

1. In your Railway service, click the **"Volumes"** tab
2. Click **"Add a Volume"**
3. Set the **Mount Path** to: `/data`
4. Click **"Create"**
5. Railway will redeploy automatically

---

### Step 6 · Copy your Railway URL

1. Click the **"Settings"** tab on your service
2. Scroll to **"Networking"** → **"Public Networking"**
3. Click **"Generate Domain"** if no URL is shown
4. Copy the URL — it looks like `https://something-random.up.railway.app`

**Save this URL. You will need it in Part 2.**

To confirm everything is working, open that URL in your browser and add `/api/health` at the end.
Example: `https://something-random.up.railway.app/api/health`

You should see: `{"status":"ok"}`

If you see that — the backend is live. ✓

---

## Part 2 — Vercel (the website)

Vercel hosts the visual interface you open in your browser every day.

---

### Step 7 · Add a new project in Vercel

1. Go to **[vercel.com](https://vercel.com)** and log in (use GitHub login)
2. From your Vercel dashboard, click **"Add New…"** → **"Project"**
3. Find **`barilanuniversitymarketing-rgb/claudecode`** in the list and click **"Import"**

> If it doesn't appear, click **"Adjust GitHub App Permissions"** and grant access to that organization.

---

### Step 8 · Configure the build settings

This is the most important step — Vercel needs to know we're deploying only the frontend subfolder.

On the project configuration screen:

1. **Project Name**: type `biu-content-writer` (or anything you like)
2. Click **"Edit"** next to "Root Directory"
3. Type: `biu-content-writer/frontend`
4. Click **"Continue"**
5. Leave Framework Preset as **"Vite"** (Vercel should detect this automatically)
6. **Do not click Deploy yet** — continue to Step 9 first

---

### Step 9 · Add the backend URL

Vercel needs to know where to send requests (the Railway URL from Step 6).

1. Expand the **"Environment Variables"** section on the same screen
2. Add one variable:

| Name | Value |
|---|---|
| `VITE_API_URL` | Your Railway URL from Step 6, e.g. `https://something-random.up.railway.app` |

> No trailing slash at the end of the URL.

---

### Step 10 · Deploy

1. Click **"Deploy"**
2. Vercel builds in about 1–2 minutes
3. When finished, Vercel shows a **"Congratulations"** screen with your live URL

Your app is live. The URL looks like `https://biu-content-writer.vercel.app`

---

## Part 3 — Verify everything works

1. Open your Vercel URL in the browser
2. You should see the BIU Content Writer interface in Hebrew
3. Type one program name in the text box (e.g. `מדעי המחשב`) and click **"צור תוכן"**
4. Watch the status badge change: pending → scraping → writing → reviewing → approved
5. When approved, click **"הורד"** to download the Word document

If this works end to end — you're done. ✓

---

## Troubleshooting

**The Railway health check fails (`/api/health` shows an error)**
- Wait another 2 minutes — the first build takes time
- Check the Railway **"Logs"** tab for red error lines
- Make sure `ANTHROPIC_API_KEY` is set correctly (no extra spaces)

**Documents stay stuck on "scraping"**
- The BIU website may have blocked the scraper temporarily. Try again in 10 minutes.
- Check Railway logs for `TimeoutError` messages

**The Vercel site loads but requests fail (network error)**
- Confirm `VITE_API_URL` in Vercel matches your Railway URL exactly, with no trailing slash
- In Vercel dashboard → your project → **Settings** → **Environment Variables** → verify the value
- After changing, go to **Deployments** and click **"Redeploy"**

**Word document won't download**
- Make sure the Railway Volume is set up (Step 5). Without it, documents can't be saved.

---

## Day-to-day use

- **Open the app**: use your Vercel URL (bookmark it)
- **Generate content**: enter program names, one per line, click Generate
- **Edit output**: click "הפעל מחדש" on any document, type what to fix
- **Download Word doc**: click "הורד" on any approved document
- **Manage templates**: click "ניהול תבניות" in the top bar

---

## Monthly costs

| Service | Plan | Cost |
|---|---|---|
| Railway | Hobby | ~$5/month (usage-based, likely less) |
| Vercel | Free | $0 |
| Anthropic | Pay-per-use | ~$0.50–2 per 10 documents generated |
| **Total** | | **~$5–7/month** |
