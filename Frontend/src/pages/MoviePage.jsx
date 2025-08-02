import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMovieStore from '../store/useMovieStore.js'; // adjust the path if needed

const MoviePage = () => {
    const { id } = useParams();
    const { movie, loading, error, getMovieById } = useMovieStore();


    useEffect(() => {
        getMovieById(id);
    }, [id, getMovieById]);

    if (loading) return <div className="mt-16">Loading...</div>;
    if (error) return <div className="mt-16 text-red-500">{error}</div>;
    if (!movie) return <div className="mt-16">Movie not found.</div>;

    return (
        <div className="mt-15 p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <img
                src={movie.photo}
                alt={movie.title}
                className="w-full max-w-md rounded"
            />
            <p className="mt-4">{movie.description}</p>
        </div>
    );
};

export default MoviePage;