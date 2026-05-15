# enes.blog

A personal blog at the intersection of nuclear engineering and software development. Posts are organized into two tracks — **Nuclear Writings** and **Programming** — each with topic tags, cover images, and a rich text editor.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, TipTap |
| Backend | Node.js, Express 5, better-sqlite3 |
| Auth | JWT (admin password, single-user) |
| Deployment | Vercel (frontend) · Railway (backend) |

## Project Structure

```
blog/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Navbar, Footer, PostCard, Editor, TagBadge
│   │   ├── context/       # AuthContext (JWT admin state)
│   │   ├── hooks/         # useTheme
│   │   ├── lib/           # API helpers
│   │   └── pages/         # Home, CategoryPage, Post, NewPost, EditPost, Login
│   └── index.html
│
└── backend/           # Express API
    ├── src/
    │   ├── controllers/   # postsController
    │   ├── middleware/    # JWT auth guard
    │   ├── routes/        # posts, upload, auth
    │   └── db.js          # SQLite setup + seeding
    ├── uploads/           # Uploaded images (gitignored)
    ├── blog.db            # SQLite database (gitignored)
    └── .env.example       # Required environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+

### Backend

```bash
cd backend
cp .env.example .env      # fill in your values
npm install
npm run dev               # runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
ADMIN_PASSWORD=your-strong-password
JWT_SECRET=your-long-random-secret
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Features

- **Two content tracks** — Nuclear Writings (green) and Programming (purple)
- **Rich text editor** — TipTap with bold, headings, code blocks, lists, blockquotes, and inline image upload
- **Cover images** — upload a cover image per post, shown as thumbnail in the list and banner on the post page
- **Tags** — up to 5 tags per post with autocomplete suggestions
- **Admin / Reader modes** — JWT-based login; edit and delete buttons only visible when signed in as admin
- **Dark / Light mode** — synced with the portfolio via `localStorage`

## Deployment

### Frontend → Vercel

1. Import the `blog` GitHub repo in Vercel
2. Set **Root Directory** to `frontend`
3. Deploy — Vite is auto-detected, no further config needed

### Backend → Railway

1. Import the same `blog` GitHub repo in Railway
2. Set **Root Directory** to `backend`
3. Add environment variables in the Railway **Variables** tab:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
4. Deploy

### After deploying

Update `frontend/src/lib/api.js` to point to your Railway backend URL:

```js
export const API = 'https://your-backend.railway.app';
```

Then redeploy the frontend.
