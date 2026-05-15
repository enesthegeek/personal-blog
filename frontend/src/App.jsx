import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Post from './pages/Post';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import './index.css';

function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (!isAdmin) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuclear" element={<CategoryPage category="nuclear" />} />
        <Route path="/programming" element={<CategoryPage category="programming" />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<RequireAdmin><NewPost /></RequireAdmin>} />
        <Route path="/edit/:id" element={<RequireAdmin><EditPost /></RequireAdmin>} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
