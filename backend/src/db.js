import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    author      TEXT    NOT NULL DEFAULT 'Enes',
    category    TEXT    NOT NULL,
    tags        TEXT    NOT NULL DEFAULT '[]',
    coverImage  TEXT    NOT NULL DEFAULT '',
    createdAt   TEXT    NOT NULL
  )
`);

// Seed only when the table is empty
const count = db.prepare('SELECT COUNT(*) as n FROM posts').get().n;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO posts (title, content, author, category, tags, coverImage, createdAt)
    VALUES (@title, @content, @author, @category, @tags, @coverImage, @createdAt)
  `);

  const seed = db.transaction(posts => {
    for (const p of posts) insert.run(p);
  });

  seed([
    {
      title: 'Understanding Neutron Moderation in Thermal Reactors',
      content: `<p>Neutron moderation is one of the most fundamental concepts in nuclear reactor design. When a uranium-235 nucleus fissions, it releases fast neutrons with energies on the order of 2 MeV. However, thermal reactors require slow — or "thermal" — neutrons at around 0.025 eV to sustain a chain reaction efficiently.</p><p>The moderator's job is to slow these fast neutrons down without absorbing them. Water, heavy water, and graphite are the three most common choices. Each has distinct trade-offs.</p><p>Light water (H₂O) is inexpensive and widely available, and it slows neutrons very effectively due to the similar mass of protons and neutrons. The downside is that it also absorbs neutrons reasonably well, which means light water reactors must use enriched uranium to compensate.</p><p>Heavy water (D₂O) — used in CANDU reactors — absorbs far fewer neutrons, allowing the use of natural uranium fuel. This independence from enrichment facilities has significant geopolitical and economic implications.</p><p>Graphite, famously used in early reactors including CP-1 and later in Chernobyl's RBMK design, is a solid moderator with low absorption cross-section. Its positive void coefficient in the RBMK contributed directly to the 1986 disaster — a sobering reminder that moderation physics and safety design are inseparable.</p>`,
      author: 'Enes',
      category: 'nuclear',
      tags: JSON.stringify(['neutron moderation', 'reactor physics', 'thermal reactors', 'nuclear safety']),
      coverImage: '',
      createdAt: new Date('2025-11-10').toISOString(),
    },
    {
      title: 'Building a REST API with Node.js and Express',
      content: `<p>When I started building backend services, Express was the first framework I reached for — and four years later, it's still my default for straightforward REST APIs. Here's how I think about structuring one from scratch.</p><p>The three layers I always separate are routes, controllers, and data access. Routes define what URLs the server responds to. Controllers contain the logic — what to do when a request arrives. Data access handles talking to the database or, in early prototypes, an in-memory store.</p><p>For a blog API, the routes are predictable: GET /api/posts returns all posts, GET /api/posts/:id returns one, POST /api/posts creates one, and so on. The interesting engineering decisions are elsewhere.</p><p>Error handling is often an afterthought, but shouldn't be. A centralized error middleware catches anything thrown in controllers and returns a consistent JSON shape. This makes client-side error handling far simpler.</p><p>For a production system, I'd add input validation (zod or joi), an ORM layer (Prisma is my current preference), and JWT authentication. But the skeleton — express, cors, dotenv, a router, controllers — scales from prototype to production with minimal structural changes.</p>`,
      author: 'Enes',
      category: 'programming',
      tags: JSON.stringify(['Node.js', 'Express', 'REST API', 'backend', 'architecture']),
      coverImage: '',
      createdAt: new Date('2025-11-20').toISOString(),
    },
    {
      title: 'Nuclear Fuel Cycles: Once-Through vs. Closed',
      content: `<p>The term "nuclear fuel cycle" describes everything that happens to nuclear fuel — from uranium mining through reactor use to final disposal or reprocessing. The choice between a once-through and a closed cycle is one of the defining strategic decisions in nuclear energy policy.</p><p>In the once-through cycle, uranium is mined, enriched, fabricated into fuel, burned in a reactor, and then the spent fuel is treated as waste for permanent geological disposal. The United States, Sweden, and Finland use this approach. It is simpler, lower in cost, and avoids the proliferation concerns associated with reprocessing.</p><p>In a closed fuel cycle, spent fuel is reprocessed to extract remaining fissile material — primarily plutonium and residual U-235 — which is then fabricated into mixed-oxide (MOX) fuel and reused. France is the leading example, reprocessing the majority of its spent fuel at La Hague.</p><p>Advanced reactor concepts — particularly fast reactors — could enable a "full" closed cycle that burns actinides currently considered waste, dramatically reducing both volume and radiotoxicity lifetime of nuclear waste.</p>`,
      author: 'Enes',
      category: 'nuclear',
      tags: JSON.stringify(['fuel cycles', 'reprocessing', 'spent fuel', 'MOX', 'waste management']),
      coverImage: '',
      createdAt: new Date('2025-12-01').toISOString(),
    },
    {
      title: 'Why I Use React for Every Frontend Project',
      content: `<p>I've tried Vue, Svelte, and plain HTML with Alpine.js. I always come back to React. Not because it's perfect — it isn't — but because its trade-offs align with how I think.</p><p>The component model maps cleanly to how I decompose problems. A page is a tree of concerns: navigation, content, sidebars, cards. React makes that tree explicit. When something breaks, I know exactly which component to open.</p><p>Vite has replaced Create React App for me entirely. Cold starts in under a second, HMR that actually works, and zero-config TypeScript. There's no reason to use CRA for new projects.</p><p>The React ecosystem is also genuinely hard to beat. React Router for navigation, Zustand for global state when I need it, React Query for server state, Tailwind for styling when I want utility classes. Each of these is composable and replaceable.</p>`,
      author: 'Enes',
      category: 'programming',
      tags: JSON.stringify(['React', 'frontend', 'Vite', 'JavaScript', 'web development']),
      coverImage: '',
      createdAt: new Date('2026-01-15').toISOString(),
    },
  ]);
}

export default db;
