import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTvShowStore from '../store/useTvShowStore.js'; // adjust the path if needed

const TvShowPage = () => {
    const { id } = useParams();
    const { tvShow, tvLoading, tverror, getTvShowById } = useTvShowStore(); // useTvShowStore is a Zustand store that manages TV show state

    useEffect(() => {
        getTvShowById(id);
    }, [id, getTvShowById]);

    if (tvLoading) return <div className="mt-16">Loading...</div>;
    if (tverror) return <div className="mt-16 text-red-500">{tverror}</div>;
    if (!tvShow) return <div className="mt-16">TV Show not found.</div>;

    return (
        <div className="mt-15 p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{tvShow.title}</h1>
            <img
                src={tvShow.photo}
                alt={tvShow.title}
                className="w-full max-w-md rounded"
            />
            <p className="mt-4">{tvShow.description}</p>
        </div>
    );
};

export default TvShowPage;
