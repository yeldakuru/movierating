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
        required: false, // Optional, as comments can be for either TV shows or movies
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: false, // Optional, as comments can be for either TV shows or movies
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
    }],
    commentText: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema); // Create a model named "Comment" using the commentSchema
export default Comment; // Export the Comment model for use in other parts of the application