import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    authUser: null,
    userComments: [],
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get('/user/checkUser'); // Check authentication status, baseURL: 'http://localhost:5001/api' is the base
            set({ authUser: response.data.user, isCheckingAuth: false }); // Set the authenticated user in the store, try { authUser: response.data}
        } catch (error) {
            console.error('Error checking authentication:', error);
            set({ authUser: null, isCheckingAuth: false });
        }
    },
    signup: async (userData) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/user/register', userData); // baseURL: 'http://localhost:5001/api' is the base
            toast.success('Account created successfully!');
            set({ authUser: response.data.user, isSigningUp: false }); // response.data
        } catch (error) {
            toast.error('Error signing up. Please try again.');
            console.error('Error signing up:', error);
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/user/logout'); // baseURL: 'http://localhost:5001/api' is the base
            set({ authUser: null });
            toast.success('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Error logging out. Please try again.', error);
        }
    },

    login: async (userData) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/user/login', userData); // baseURL: 'http://localhost:5001/api' is the base
            set({ authUser: response.data.user, isLoggingIn: false }); // response.data
            toast.success('Logged in successfully!');
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Error logging in. Please try again.');
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (userData) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put('/user/profileUpdate', userData); // baseURL: 'http://localhost:5001/api' is the base
            set({ authUser: response.data.user, isUpdatingProfile: false }); // response.data
            toast.success('✅ Profile updated successfully!');
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            toast.error('Error updating profile. Please try again.');
            set({ isUpdatingProfile: false });
        }
    },
    fetchUserComments: async () => {
        const { authUser } = get();
        if (!authUser?._id) return;

        set({ isFetchingComments: true });

        try {
            const res = await axiosInstance.get(`/comments/user/${authUser._id}`);
            set({ userComments: res.data, isFetchingComments: false });
        } catch (error) {
            console.error('❌ Error fetching user comments:', error);
            toast.error('Failed to fetch your comments.');
            set({ isFetchingComments: false });
        }
    },

}));