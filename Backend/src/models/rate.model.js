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
        required: false,
    },
    tvShowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TVShow",
        required: false,
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
}, { timestamps: true });

const Rate = mongoose.model("Rate", rateSchema);
export default Rate;
// Bu model, kullanıcıların filmler ve TV şovları için verdikleri puanları tutar.