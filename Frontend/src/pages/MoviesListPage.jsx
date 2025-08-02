import { useEffect } from 'react';
import useMovieStore from '../store/useMovieStore';
import ListCard from '../components/ListCard';
import { Loader } from 'lucide-react';

const MoviesListPage = () => {
    const { movies, fetchMovies, loading, error } = useMovieStore();

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-15 animate-spin" />
        </div>
    );

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="p-6 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">Movies</h1>
            {movies.slice(0, 20).map((movie) => (
                <ListCard key={movie._id} content={movie} route="movie" />
            ))}
        </div>
    );
};

export default MoviesListPage;