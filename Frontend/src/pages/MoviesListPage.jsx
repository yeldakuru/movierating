import { useEffect } from 'react';
import useMovieStore from '../store/useMovieStore';
import ListCard from '../components/ListCard';
import { useTheme } from '../store/useThemeStore';  // useTheme import edildi

const MoviesListPage = () => {
    const { movies, fetchMovies, loading, error } = useMovieStore();
    const { lightMode } = useTheme();

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    useEffect(() => {
        localStorage.setItem("lightMode", lightMode);
        if (lightMode) {
            document.documentElement.classList.remove("dark");
            document.body.style.backgroundColor = "#fef9f5";  // Açık mod arka planı
        } else {
            document.documentElement.classList.add("dark");
            // Dark modda arka plan rengini değiştirme, olduğu gibi bırak
            document.body.style.backgroundColor = ""; // Veya null, böylece önceki stil kalır
        }
    }, [lightMode]);


    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className={`p-6 flex flex-col items-center gap-6 ${lightMode ? "text-black" : "text-white"}`}>
            <h1 className="text-3xl font-bold mb-4">Movies</h1>
            {movies.slice(0, 20).map((movie) => (
                <ListCard key={movie._id} movie={movie} route="movie" />
            ))}
        </div>
    );
};

export default MoviesListPage;
