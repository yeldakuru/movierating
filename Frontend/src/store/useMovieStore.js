import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

const useMovieStore = create((set) => ({
    movies: [],
    movie: null,
    hotmovies: [],
    loading: false,
    error: null,

    fetchMovies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/movies');
            set({ movies: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            set({ error: 'Failed to fetch movies', loading: false });
        }
    },

    getMovieById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/movies/${id}`);
            set({ movie: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch movie:', err);
            set({ error: 'Failed to fetch movie', loading: false });
        }
    },

    fetchHotMovies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/movies/hotmovies');
            set({ hotmovies: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch hot movies:', err);
            set({ error: 'Failed to fetch hot movies', loading: false });
        }
    },

    rateMovie: async (movieId, rating, userId) => {
        if (!userId) {
            throw new Error("User ID is required but undefined or null.");
        }

        try {
            // Backend API, kullanıcı oylarını alıyor ve yeni ortalamayı döndürüyor varsayalım
            const existingRatings = await axiosInstance.get(`/ratings/user/${userId}`);
            const existingRating = existingRatings.data.find(
                (r) => r.movieId === movieId
            );

            let response;

            if (existingRating) {
                response = await axiosInstance.put(`/ratings/${existingRating._id}`, {
                    rate: rating,
                });
            } else {
                response = await axiosInstance.post("/ratings", {
                    movieId,
                    rate: rating,
                });
            }

            set((state) => ({
                movie: {
                    ...state.movie,
                    averageRating:
                        response.data.newAverageRating || state.movie.averageRating,
                    userRating: rating,
                },
            }));

            toast.success("Rating saved successfully!");
            return response.data;
        } catch (err) {
            console.error("Rating error:", err);
            toast.error(err.response?.data?.message || "Oy kaydedilirken hata oluştu.");
            throw err;
        }
    },
}));

export default useMovieStore;
