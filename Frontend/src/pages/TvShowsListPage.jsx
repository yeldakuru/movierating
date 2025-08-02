import React, { useEffect } from 'react';
import useMovieStore from '../store/useMovieStore';
import ListCard from '../components/ListCard';

const TvShowsListPage = () => {
    const { tvShows, fetchTvShows, loading, error } = useMovieStore();

    useEffect(() => {
        fetchTvShows();
    }, [fetchTvShows]);

    if (loading) return <div className="text-center mt-15">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

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