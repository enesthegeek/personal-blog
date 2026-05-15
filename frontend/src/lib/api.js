export const API = 'http://localhost:5000';

function authHeader() {
  const token = localStorage.getItem('blog-admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(password) {
  const r = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!r.ok) throw new Error('Incorrect password');
  return r.json(); // { token }
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('image', file);
  const r = await fetch(`${API}/api/upload`, { method: 'POST', headers: authHeader(), body: fd });
  if (!r.ok) throw new Error('Upload failed');
  const { url } = await r.json();
  return `${API}${url}`;
}

export async function getPost(id) {
  const r = await fetch(`${API}/api/posts/${id}`);
  if (!r.ok) throw new Error('Post not found');
  return r.json();
}

export async function createPost(data) {
  const r = await fetch(`${API}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Failed to create post');
  return r.json();
}

export async function updatePost(id, data) {
  const r = await fetch(`${API}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Failed to update post');
  return r.json();
}

export async function deletePost(id) {
  const r = await fetch(`${API}/api/posts/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!r.ok) throw new Error('Failed to delete post');
}
