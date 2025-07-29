import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useTvShowStore = create((set) => ({
    tvShows: [],
    tvShow: null,
    tvLoading: false,
    tverror: null,

    fetchTvShows: async () => {
        set({ tvLoading: true, tverror: null });
        try {
            const res = await axiosInstance.get('/tvshows'); // http://localhost:5000/api/tvshows
            set({ tvShows: res.data, tvLoading: false });
        } catch (err) {
            console.error('Failed to fetch tv shows:', err);
            set({ tverror: 'Failed to fetch tv shows', tvLoading: false });
        }
    },
    getTvShowById: async (id) => {
        set({ tvLoading: true, tverror: null });
        try {
            const res = await axiosInstance.get(`/tvshows/${id}`); // http://localhost:5000/api/tvshows/:id
            set({ tvShow: res.data, tvLoading: false });
        } catch (err) {
            console.error('Failed to fetch tv show:', err);
            set({ tverror: 'Failed to fetch tv show', tvLoading: false });
        }
    },
}));

export default useTvShowStore;