import mongoose from "mongoose";

const tvShowSchema = new mongoose.Schema({
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
    seasonNumber: {
        type: Number,
        required: true,
        min: 1, // At least one season
    },
    episodeNumber: {
        type: Number,
        required: true,
        min: 1, // At least one episode
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: false,
        default: Date.now, // Default to current date if not provided
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

const TvShow = mongoose.model("TvShow", tvShowSchema); // Create a model named "User" using the userSchema
export default TvShow; // Export the User model for use in other parts of the application