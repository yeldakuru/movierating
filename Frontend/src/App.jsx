import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MoviePage from './pages/MoviePage'
import LoginPage from './pages/LoginPage'
import TvShowPage from './pages/TvShowPage'
import SignUpPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MoviesListPage from './pages/MoviesListPage'
import TvShowsListPage from './pages/TvShowsListPage'
import ThemePage from './pages/ThemePage'
import AdminPage from './pages/AdminPage'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'
import { useUserStore } from './store/useUserStore.js'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

function App() {

  const { authUser, checkAuth, isCheckingAuth } = useUserStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth();
    };

    checkUserAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-15 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/tvshows" element={<TvShowsListPage />} />
        <Route path="/tvshow/:id" element={<TvShowPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/themes" element={<ThemePage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/admin" element={authUser && authUser?.email === "yelda123@hotmail.com" ? <AdminPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Footer />
    </div>
  )
}

export default App