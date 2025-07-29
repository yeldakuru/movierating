import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useMovieStore = create((set) => ({
    movies: [],
    movie: null,
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
}));

export default useMovieStore;