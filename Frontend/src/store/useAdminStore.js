// 📁 src/store/useAdminStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useAdminStore = create((set) => ({
    creating: false,
    items: [],
    loadingItems: false,
    selectedItem: null,
    isEditing: false,

    fetchItems: async () => {
        set({ loadingItems: true });
        try {
            const [moviesRes, tvRes] = await Promise.all([
                axiosInstance.get("/movies"),
                axiosInstance.get("/tvshows"),
            ]);
            set({ items: [...moviesRes.data, ...tvRes.data], loadingItems: false });
        } catch (err) {
            toast.error("Failed to fetch content.", err);
            set({ loadingItems: false });
        }
    },

    createMovie: async (formData) => {
        set({ creating: true });
        try {
            await axiosInstance.post("/admin/movies", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("🎬 Movie created.");
        } catch (err) {
            toast.error("Error creating movie.");
            console.error(err);
        } finally {
            set({ creating: false });
        }
    },

    createTvShow: async (formData) => {
        set({ creating: true });
        try {
            await axiosInstance.post("/admin/tvshows", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("📺 TV Show created.");
        } catch (err) {
            toast.error("Error creating TV Show.", err);
        } finally {
            set({ creating: false });
        }
    },

    deleteItem: async (item) => {
        try {
            const url = item.seasonNumber
                ? `/admin/tvshows/${item._id}`
                : `/admin/movies/${item._id}`;
            await axiosInstance.delete(url);
            toast.success("Deleted!");
            set((state) => ({
                items: state.items.filter((i) => i._id !== item._id),
            }));
        } catch (err) {
            toast.error("Delete failed.", err);
        }
    },

    updateItem: async (formData, id, type) => {
        set({ creating: true });
        try {
            await axiosInstance.put(`/admin/${type}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Updated!");
        } catch (err) {
            toast.error("Update failed.", err);
        } finally {
            set({ creating: false, selectedItem: null, isEditing: false });
        }
    },

    setEditingItem: (item) => {
        set({ selectedItem: item, isEditing: true });
    },
}));

export default useAdminStore;