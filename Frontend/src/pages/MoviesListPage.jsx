import { useEffect, useState, useMemo } from 'react';
import useMovieStore from '../store/useMovieStore';
import ListCard from '../components/ListCard';
import { Loader } from 'lucide-react';

const sortOptions = [
    { id: 'rating', label: 'Sort by Rating' },
    { id: 'date', label: 'Sort by Release Date' },
    { id: 'name', label: 'Sort by Name' },
];

const MoviesListPage = () => {
    const { movies, fetchMovies, loading, error } = useMovieStore();
    const [sortBy, setSortBy] = useState('rating');

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const sortedMovies = useMemo(() => {
        if (!movies) return [];

        const list = [...movies];

        switch (sortBy) {
            case 'rating':
                return list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
            case 'date':
                return list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'name':
                return list.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return list;
        }
    }, [movies, sortBy]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-15 animate-spin" />
            </div>
        );

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="p-6 pt-20 max-w-6xl mx-auto flex flex-col gap-6">
            {/* Navbar altı boşluk için pt-20 */}

            {/* Sıralama barı */}
            <div className="flex space-x-4 bg-base-200 p-3 rounded shadow-sm text-sm font-semibold select-none sticky top-20 z-10">
                {sortOptions.map((option) => (
                    <button
                        key={option.id}
                        className={`px-3 py-1 rounded ${sortBy === option.id
                            ? 'bg-primary text-primary-content'
                            : 'bg-base-100 hover:bg-base-300'
                            }`}
                        onClick={() => setSortBy(option.id)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Film kartları */}
            <div className="flex flex-col gap-6">
                {sortedMovies.slice(0, 20).map((movie) => (
                    <ListCard key={movie._id} content={movie} route="movie" />
                ))}
            </div>
        </div>
    );
};

export default MoviesListPage;
