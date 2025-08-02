import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useMovieStore = create((set) => ({
    movies: [],
    movie: null,
    hotmovies: [],
    loading: false,
    error: null,

    fetchMovies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/movies'); // http://localhost:5000/api/movies
            set({ movies: res.data, loading: false }); //res bir json dosyası onu movies e atıyoruz.
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            set({ error: 'Failed to fetch movies', loading: false });
        }
    },
    getMovieById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/movies/${id}`); // http://localhost:5000/api/movies/:id
            set({ movie: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch movie:', err);
            set({ error: 'Failed to fetch movie', loading: false });
        }
    },
    fetchHotMovies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/movies/hotmovies'); // http://localhost:5000/api/movies/hotmovies
            set({ hotmovies: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch hot movies:', err);
            set({ error: 'Failed to fetch hot movies', loading: false });
        }
    },
}));

export default useMovieStore;