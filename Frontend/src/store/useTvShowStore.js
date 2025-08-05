import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
const useTvShowStore = create((set) => ({
    tvShows: [],
    tvShow: null,
    hottvshows: [],
    tvLoading: false,
    tverror: null,

    fetchTvShows: async () => {
        set({ tvLoading: true, tverror: null });
        try {
            const res = await axiosInstance.get('/tvshows');
            set({ tvShows: res.data, tvLoading: false });
        } catch (err) {
            console.error('Failed to fetch tv shows:', err);
            set({ tverror: 'Failed to fetch tv shows', tvLoading: false });
        }
    },

    getTvShowById: async (id) => {
        set({ tvLoading: true, tverror: null });
        try {
            const res = await axiosInstance.get(`/tvshows/${id}`);
            set({ tvShow: res.data, tvLoading: false });
        } catch (err) {
            console.error('Failed to fetch tv show:', err);
            set({ tverror: 'Failed to fetch tv show', tvLoading: false });
        }
    },

    fetchHotTvShows: async () => {
        set({ tvLoading: true, tverror: null });
        try {
            const res = await axiosInstance.get('/tvshows/hottvshows');
            set({ hottvshows: res.data, tvLoading: false });
        } catch (err) {
            console.error('Failed to fetch hot TV shows:', err);
            set({ tverror: 'Failed to fetch hot TV shows', tvLoading: false });
        }
    },

    rateTvShow: async (tvShowId, rating, userId) => {
        if (!userId) {
            throw new Error("User ID is required but undefined or null.");
        }

        try {
            const existingRatings = await axiosInstance.get(`/ratings/user/${userId}`);
            const existingRating = existingRatings.data.find(
                (r) => r.tvShowId === tvShowId
            );

            let response;

            if (existingRating) {
                response = await axiosInstance.put(`/ratings/${existingRating._id}`, {
                    rate: rating,
                });
            } else {
                response = await axiosInstance.post("/ratings", {
                    tvShowId,
                    rate: rating,
                });
            }

            set((state) => ({
                tvShow: {
                    ...state.tvShow,
                    averageRating:
                        response.data.newAverageRating || state.tvShow.averageRating,
                    userRating: rating, // kullanıcı oyunu da ekledik
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

export default useTvShowStore;
