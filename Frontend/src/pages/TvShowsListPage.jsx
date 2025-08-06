import { useEffect } from 'react';
import useTvShowStore from '../store/useTvShowStore';
import ListCard from '../components/ListCard';
import { Loader } from 'lucide-react';

const TvShowsListPage = () => {
    const { tvShows, fetchTvShows, tvLoading, tverror } = useTvShowStore();

    useEffect(() => {
        fetchTvShows();
    }, [fetchTvShows]);

    if (tvLoading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-15 animate-spin" />
        </div>
    );
    if (tverror) return <div className="text-center mt-10 text-red-500">{tverror}</div>;

    return (
        <div className="p-6 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">TvShows</h1>
            {tvShows.slice(0, 20).map((Tvshow) => (
                <ListCard key={Tvshow._id} content={Tvshow} route="tvshow" />
            ))}
        </div>
    );
}

export default TvShowsListPage