import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useMovieStore = create((set) => ({
    movies: [],
    loading: false,
    error: null,

    fetchMovies: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/movies'); // http://localhost:5000/api/movies
            set({ movies: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            set({ error: 'Failed to fetch movies', loading: false });
        }
    },
}));

export default useMovieStore;