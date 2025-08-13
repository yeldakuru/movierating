import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
}, { timestamps: true });

const Likes = mongoose.model("Likes", likesSchema); // Create a model named "Comment" using the commentSchema
export default Likes; // Export the Comment model for use in other parts of the application