import db from '../db.js';

function deserialize(row) {
  if (!row) return null;
  return { ...row, tags: JSON.parse(row.tags) };
}

export const getAllPosts = (req, res) => {
  const { category } = req.query;
  const rows = category
    ? db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY createdAt DESC').all(category)
    : db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all();
  res.json(rows.map(deserialize));
};

export const getPostById = (req, res) => {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Post not found' });
  res.json(deserialize(row));
};

export const createPost = (req, res) => {
  const { title, content, author, category, tags, coverImage } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'title, content, and category are required' });
  }
  const result = db.prepare(`
    INSERT INTO posts (title, content, author, category, tags, coverImage, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    content,
    author || 'Enes',
    category,
    JSON.stringify(Array.isArray(tags) ? tags : []),
    coverImage || '',
    new Date().toISOString(),
  );
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(deserialize(post));
};

export const updatePost = (req, res) => {
  const { title, content, author, category, tags, coverImage } = req.body;
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Post not found' });
  db.prepare(`
    UPDATE posts SET
      title      = ?,
      content    = ?,
      author     = ?,
      category   = ?,
      tags       = ?,
      coverImage = ?
    WHERE id = ?
  `).run(
    title      ?? existing.title,
    content    ?? existing.content,
    author     ?? existing.author,
    category   ?? existing.category,
    tags       ? JSON.stringify(tags) : existing.tags,
    coverImage ?? existing.coverImage,
    req.params.id,
  );
  res.json(deserialize(db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)));
};

export const deletePost = (req, res) => {
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Post not found' });
  res.status(204).send();
};
