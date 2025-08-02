// 📁 src/pages/HomePage.jsx
import { useEffect } from 'react';
import useMovieStore from '../store/useMovieStore.js';
import useTvShowStore from '../store/useTvShowStore.js';
import MovieCard from '../components/MovieCard.jsx';
import TvShowCard from '../components/TvShowCard.jsx';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { hotmovies, fetchHotMovies, loading, error } = useMovieStore();
    const { hottvshows, fetchHotTvShows, tvLoading, tverror } = useTvShowStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHotMovies();
        fetchHotTvShows();
    }, [fetchHotMovies, fetchHotTvShows]);

    return (
        <div className='pt-16'>


            {/* Carousel - First 4 Movies */}
            <div className="flex justify-center mt-5">
                <div className="carousel w-[90%] max-h-[400px] rounded-box overflow-hidden">
                    {hotmovies.slice(0, 4).map((hottvshows, index) => (
                        <div
                            key={hottvshows._id}
                            id={`slide${index + 1}`}
                            className="carousel-item relative w-full"
                        >
                            <div
                                className="w-full h-full cursor-pointer"
                                onClick={() => navigate(`/movie/${hottvshows._id}`)}
                            >
                                <img
                                    src={hottvshows.photo}
                                    alt={hottvshows.title}
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xl font-bold p-4">
                                    {hottvshows.title}
                                </div>
                            </div>

                            {/* Arrows (excluded from the clickable area) */}
                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
                                <a href={`#slide${index === 0 ? 4 : index}`} className="btn btn-circle bg-white text-black">❮</a>
                                <a href={`#slide${(index + 2) > 4 ? 1 : index + 2}`} className="btn btn-circle bg-white text-black">❯</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Movie Cards */}
            <div className="p-4 space-y-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold">Hot Movies</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotmovies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            </div>


            {/* TvShowCard Cards */}
            <div className="p-4 space-y-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold">Hot TvShows</h1>
                {tvLoading && <p>Loading...</p>}
                {tverror && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hottvshows.map((tvShow) => (
                        <TvShowCard key={tvShow._id} a={tvShow} />
                    ))}
                </div>
            </div>
        </div>

    );
};

export default HomePage;