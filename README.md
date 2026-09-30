# Project-Driven Learning

> Learn by doing real-world projects, guided by industry mentors.

FEIT Hackathon 2026 · Untapped challenge: *Engineering the Future of Learning*

Students and career changers need hands-on experience, but online learning rarely gives it. This platform lets learners join a team, work on a realistic workplace project written by an industry mentor, record who did what, and get AI feedback based on the mentor's own criteria.

📘 Full plan: [docs/execution-plan.md](docs/execution-plan.md)
🗄️ Database design: [docs/data-structure.md](docs/data-structure.md)

---

## ✅ MVP status

| Feature | Status |
|---------|--------|
| Browse and choose projects | ✅ Built |
| Join a project (creates or fills a team) | ✅ Built |
| Task board (To do, In progress, Done) | ✅ Built |
| Submit work for a task | ✅ Built |
| Contribution form | ✅ Built |
| AI task feedback based on mentor criteria | ✅ Built (Claude API) |
| Career assessment and project matching | 🎭 Simulated (fixed result per demo learner) |
| Login | 🎭 Simulated ("Viewing as" switch in the header) |
| AI personal analysis, course recommendations | 🎨 Mockup only |

---

## 🛠️ Tech stack

* **Frontend and backend:** Next.js (React)
* **Database:** Firebase Firestore
* **AI:** Claude API
* **Design:** Figma
* **Deployment:** Vercel
* **Collaboration:** GitHub

---

## 🚀 Run it on your computer

### 1. Install once

* [Node.js](https://nodejs.org) (LTS version)
* [Git](https://git-scm.com)
* [VS Code](https://code.visualstudio.com) (recommended)

### 2. Install packages

Open a terminal in this folder and run:

```bash
npm install
```

### 3. Start the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser. 🎉

The app works straight away in **demo mode**: data is saved in your browser, and AI feedback is simulated. Add keys (below) to switch on the real parts.

---

## 🔑 Add your keys (optional)

1. Copy `.env.example` and rename the copy to `.env.local`
2. Fill in the values you have
3. Stop the app (`Ctrl + C`) and run `npm run dev` again

`.env.local` is ignored by Git, so your keys are never uploaded. Never paste keys into any other file.

### Claude API (real AI feedback)

1. Create a key at https://console.anthropic.com
2. Put it in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Firebase (shared database)

Demo mode saves data only in your own browser, so teammates cannot see each other's changes. Firebase fixes that.

1. Go to https://console.firebase.google.com and create a project
2. **Build > Firestore Database > Create database**, choose **test mode** (fine for a hackathon)
3. **Project settings > Your apps > Web app (</>)**, register the app
4. Copy the `firebaseConfig` values into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

5. Restart the app, open http://localhost:3000/setup and click **Load demo data into Firebase**

The badge in the header shows which mode you are in: **Demo data** or **Firebase**.

⚠️ Test mode rules expire after 30 days and let anyone read and write. That is fine for the hackathon, not for a real product.

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com, click **Add New > Project** and import the repo
3. In **Environment Variables**, add the same keys as your `.env.local`
4. Click **Deploy**

---

## 🎬 Demo script

1. **Home:** Mia's simulated career result shows *UX Design* with a short reason
2. **Projects:** matching projects appear first with a *Matches your result* badge
3. **Team board:** open *Redesign a banking app onboarding flow*, already in progress with Liam
4. **Task:** open *Interview 3 users*, see the submission and both contributions, click **Get AI feedback**
5. **Teamwork:** switch *Viewing as* to another learner, join a project, move tasks across the board

Before a pitch, open `/setup` and click **Reset demo data** so the demo starts clean.

---

## 📁 Project structure

```
app/
  page.js                          Home: career result + my teams
  projects/page.js                 Browse projects
  projects/[id]/page.js            Project brief, mentor criteria, Join
  teams/[id]/page.js               Task board
  teams/[id]/tasks/[taskId]/page.js  Task: submission, contributions, AI feedback
  setup/page.js                    Load demo data into Firebase / reset demo mode
  api/feedback/route.js            Calls the Claude API (runs on the server, keeps the key secret)
components/
  Header.js                        Menu, mode badge, "Viewing as" switch
  UserProvider.js                  Remembers the current demo learner
  ContributionForm.js              Contribution form
  FeedbackPanel.js                 Shows and requests AI feedback
lib/
  db.js                            Every read and write (Firebase or demo mode)
  seed.js                          Demo users, projects, team and tasks
  firebase.js                      Firebase connection
  mockStore.js                     Demo mode storage in the browser
  config.js                        App name and tagline
docs/
  execution-plan.md                Problem, user flow, design decisions, MVP
  data-structure.md                Firestore collections and fields
```

### Common changes

* **App name:** `lib/config.js`
* **Colours and fonts (to match Figma):** the variables at the top of `app/globals.css`
* **Projects, criteria, demo learners:** `lib/seed.js` (then reset demo data, or reload it into Firebase at `/setup`)
* **How the AI gives feedback:** `SYSTEM_PROMPT` in `app/api/feedback/route.js`
