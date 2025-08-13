import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: false, // Optional, as ratings can be for either TV shows or movies
    },
    tvShowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TvShow",
        required: false, // Optional, as ratings can be for either TV shows or movies
    },
    rate: {
        type: Number,
        required: true,
        min: 1, // Minimum rating value
        max: 10, // Maximum rating value
    },
}, { timestamps: true });

const Rate = mongoose.model("Rate", rateSchema);
export default Rate; 