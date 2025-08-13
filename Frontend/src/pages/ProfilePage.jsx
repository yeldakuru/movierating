import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore.js';
import { Droplet } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
    const {
        authUser,
        updateProfile,
        userComments,
        fetchUserComments,
        isUpdatingProfile,
    } = useUserStore();

    const [formData, setFormData] = useState({
        username: authUser?.username || '',
        profilePic: '', // this will hold base64 string
    });

    useEffect(() => {
        if (authUser?._id) {
            fetchUserComments();
        }
    }, [authUser, fetchUserComments]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username.trim()) {
            toast.error('Username cannot be empty');
            return;
        }
        await updateProfile(formData);
    };

    return (
        <div className="mt-16 max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                >
                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            {/* Display current profile info */}
            {authUser && (
                <div className="mt-10 flex items-center space-x-4">
                    {authUser.profilePic ? (
                        <img
                            src={authUser.profilePic}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <Droplet className="text-5xl text-gray-400" />
                    )}
                    <div>
                        <p className="font-semibold">{authUser.username}</p>
                        <p className="text-gray-500 text-sm">{authUser.email}</p>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Your Comments</h2>
                {userComments.length === 0 ? (
                    <p className="text-gray-600">You haven't posted any comments yet.</p>
                ) : (
                    <div className="space-y-4">
                        {userComments.map((comment) => (
                            <div
                                key={comment._id}
                                className="p-4 border rounded-md shadow-sm bg-white"
                            >
                                <p className="mb-2">{comment.commentText}</p>
                                <p className="text-sm text-gray-500">
                                    On: {comment.movieId?.title || comment.tvShowId?.title || 'Unknown'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;