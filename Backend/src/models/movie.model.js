import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
        default: "",
    },
    genre: {
        type: [String],
        enum: ["comedy", "action", "horror", "romance", "documentary", "drama", "thriller", "sci-fi", "fantasy"],
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    trailerLink: {
        type: String,
        required: true,
        default: "",
    },
    director: {
        type: String,
        required: true,
    },
    cast: {
        type: [String], // Array of actor names
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    ratingsCount: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
