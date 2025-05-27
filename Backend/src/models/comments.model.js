import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // createdAt ve updatedAt alanlarını otomatik olarak ekler
const Comment = mongoose.model("Comment", commentsSchema);
export default Comment;