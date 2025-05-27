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
        validate: {
            validate: {
                validator: arr => arr.length > 0,
                message: 'At least one genre is required.'
            }
        },
    },

    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // dakika cinsinden
        required: true,
    },
    director: {
        type: String,
        required: true,
    },

    trailerLink: {
        type: String,
        required: true,
        default: "",
    },
    averageRating: {
        type: Number,
        default: 0, // Başlangıçta ortalama puan 0 olarak ayarlanır
        min: 0, // Puan 0 ile 10 arasında olmalıdır
        max: 10, // Puan 0 ile 10 arasında olmalıdır
    },
    ratingCount: {
        type: Number,
        default: 0, // Başlangıçta rating sayısı 0 olarak ayarlanır
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    cast: {
        type: [String], // Oyuncuların isimleri
        required: true,
    },
}, { timestamps: true }); // createdAt ve updatedAt alanlarını otomatik olarak ekler

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
