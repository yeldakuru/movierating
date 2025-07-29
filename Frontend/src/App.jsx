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
import { Toaster } from 'react-hot-toast'

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/tvshows" element={<TvShowsListPage />} />
        <Route path="/tvshow/:id" element={<TvShowPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Footer />
    </>
  )
}

export default App