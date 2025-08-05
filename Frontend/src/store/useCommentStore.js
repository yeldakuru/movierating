import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useUserStore } from "./useUserStore"; // import inside the file

const useCommentStore = create((set) => ({
    comments: [],
    loadingComments: false,
    postingComment: false,
    toggleLiking: {},

    fetchCommentsByMovie: async (movieId) => {
        set({ loadingComments: true });
        try {
            const res = await axiosInstance.get(`/comments/movie/${movieId}`);
            const authUser = useUserStore.getState().authUser;

            const formatted = res.data.map((comment) => ({
                id: comment._id,
                user: comment.userId?.username || "Anonymous",
                text: comment.commentText,
                date: comment.createdAt,
                likesCount: comment.likes?.length || 0,
                likedByUser: comment.likes?.some((like) => like.userId === authUser?._id),
            }));

            set({ comments: formatted, loadingComments: false });
        } catch (err) {
            toast.error("Failed to fetch comments", err.message);
            set({ loadingComments: false });
        }
    },
    fetchCommentsByTvShow: async (tvShowId) => {
        set({ loadingComments: true });
        try {
            const res = await axiosInstance.get(`/comments/tvshow/${tvShowId}`);
            const authUser = useUserStore.getState().authUser;

            const formatted = res.data.map((comment) => ({
                id: comment._id,
                user: comment.userId?.username || "Anonymous",
                text: comment.commentText,
                date: comment.createdAt,
                likesCount: comment.likes?.length || 0,
                likedByUser: comment.likes?.some(
                    (like) => like.userId === authUser?._id
                ),
            }));

            set({ comments: formatted, loadingComments: false });
        } catch (err) {
            toast.error("Failed to fetch comments", err.message);
            set({ loadingComments: false });
        }
    },

    addComment: async (movieId, commentText) => {
        if (!commentText.trim()) return;

        const authUser = useUserStore.getState().authUser;
        if (!authUser) {
            toast.error("You must be logged in to comment.");
            return;
        }

        set({ postingComment: true });

        try {
            const res = await axiosInstance.post("/comments", {
                movieId,
                commentText,
            });

            const newComment = res.data;

            set((state) => ({
                comments: [
                    {
                        id: newComment._id,
                        user: authUser.username || "Anonymous",
                        text: newComment.commentText,
                        date: newComment.createdAt,
                        likesCount: 0,
                        likedByUser: false,
                    },
                    ...state.comments,
                ],
                postingComment: false,
            }));
            toast.success("Comment added");
        } catch (err) {
            console.error("Error posting comment:", err);
            toast.error("Failed to add comment");
            set({ postingComment: false });
        }
    },

    addCommentTv: async (tvShowId, commentText) => {
        if (!commentText.trim()) return;

        const authUser = useUserStore.getState().authUser;
        if (!authUser) {
            toast.error("You must be logged in to comment.");
            return;
        }

        set({ postingComment: true });

        try {
            const res = await axiosInstance.post("/comments", {
                tvShowId,
                commentText,
            });

            const newComment = res.data;

            set((state) => ({
                comments: [
                    {
                        id: newComment._id,
                        user: authUser.username || "Anonymous",
                        text: newComment.commentText,
                        date: newComment.createdAt,
                        likesCount: 0,
                        likedByUser: false,
                    },
                    ...state.comments,
                ],
                postingComment: false,
            }));
            toast.success("Comment added");
        } catch (err) {
            console.error("Error posting comment:", err);
            toast.error("Failed to add comment");
            set({ postingComment: false });
        }
    },
    updateComment: async (commentId, newText) => {
        if (!newText.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        try {
            const res = await axiosInstance.put(`/comments/${commentId}`, {
                commentText: newText,
            });

            set((state) => ({
                comments: state.comments.map((c) =>
                    c.id === commentId
                        ? {
                            ...c,
                            text: res.data.commentText || newText,
                            // update date if needed, or keep original
                        }
                        : c
                ),
            }));

            toast.success("Comment updated");
        } catch (err) {
            console.error("Error updating comment:", err);
            toast.error("Failed to update comment");
        }
    },

    deleteComment: async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);

            set((state) => ({
                comments: state.comments.filter((c) => c.id !== commentId),
            }));

            toast.success("Comment deleted");
        } catch (err) {
            console.error("Error deleting comment:", err);
            toast.error("Failed to delete comment");
        }
    },

    toggleLike: async (commentId) => {
        const authUser = useUserStore.getState().authUser;
        if (!authUser) {
            toast.error("Login required to like a comment.");
            return;
        }

        set((state) => ({
            toggleLiking: { ...state.toggleLiking, [commentId]: true },
        }));

        try {
            await axiosInstance.post(`/comments/${commentId}/like`);
            set((state) => ({
                comments: state.comments.map((c) =>
                    c.id === commentId
                        ? {
                            ...c,
                            likedByUser: !c.likedByUser,
                            likesCount: c.likedByUser
                                ? c.likesCount - 1
                                : c.likesCount + 1,
                        }
                        : c
                ),
                toggleLiking: { ...state.toggleLiking, [commentId]: false },
            }));
        } catch (err) {
            toast.error("Error toggling like", err.message);
            set((state) => ({
                toggleLiking: { ...state.toggleLiking, [commentId]: false },
            }));
        }
    },
}));

export default useCommentStore;