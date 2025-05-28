import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tvShowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TvShow",
        required: false,
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: false,
    },
    commentText: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
    }],
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema); // Create a model named "Comment" using the commentSchema
export default Comment; // Export the Comment model for use in other parts of the application