import { useEffect, useState, useMemo } from 'react';
import useTvShowStore from '../store/useTvShowStore';
import ListCard from '../components/ListCard';
import { Loader } from 'lucide-react';

const sortOptions = [
    { id: 'rating', label: 'Sort by Rating' },
    { id: 'date', label: 'Sort by Release Date' },
    { id: 'name', label: 'Sort by Name' },
];

const TvShowsListPage = () => {
    const { tvShows, fetchTvShows, tvLoading, tverror } = useTvShowStore();
    const [sortBy, setSortBy] = useState('rating');

    useEffect(() => {
        fetchTvShows();
    }, [fetchTvShows]);

    const sortedTvShows = useMemo(() => {
        if (!tvShows) return [];

        const shows = [...tvShows];

        switch (sortBy) {
            case 'rating':
                return shows.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case 'date':
                return shows.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'name':
                return shows.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return shows;
        }
    }, [tvShows, sortBy]);

    if (tvLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-15 animate-spin" />
            </div>
        );
    if (tverror) return <div className="text-center mt-10 text-red-500">{tverror}</div>;

    return (
        <div className="p-6 pt-20 max-w-6xl mx-auto flex flex-col gap-6">
            {/* pt-20: Navbarın altında kalmaması için üst boşluk */}
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

            {/* Dizi kartları */}
            <div className="flex flex-col gap-6">
                {sortedTvShows.slice(0, 20).map((tvshow) => (
                    <ListCard key={tvshow._id} content={tvshow} route="tvshow" />
                ))}
            </div>
        </div>
    );
};

export default TvShowsListPage;
