import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useTvShowStore = create((set) => ({
    tvShows: [],
    tvShow: null,
    hottvshows: [],
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
    fetchHotTvShows: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/tvshows/hottvshows'); // http://localhost:5000/api/tvshows/hottvshows
            set({ hottvshows: res.data, loading: false });
        } catch (err) {
            console.error('Failed to fetch hot TV shows:', err);
            set({ error: 'Failed to fetch hot TV shows', loading: false });
        }
    },
}));

export default useTvShowStore;