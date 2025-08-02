import React, { useEffect } from 'react';
import useTvShowStore from '../store/useTvShowStore.js';
import ListCard from '../components/ListCard';

const TvShowsListPage = () => {
    const { tvShows, fetchTvShows, tvLoading, tverror } = useTvShowStore();

    useEffect(() => {
        fetchTvShows();
    }, [fetchTvShows]);

    if (tvLoading) return <div className="text-center mt-15">Loading...</div>;
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