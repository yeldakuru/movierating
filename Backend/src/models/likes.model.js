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

const Likes = mongoose.model("Likes", likesSchema); // Create a model named "Likes" using the likesSchema
export default Likes; // Export the Likes model for use in other parts of the application