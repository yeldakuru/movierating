import mongoose from "mongoose";

const tvshowSchema = new mongoose.Schema({
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
        min: 1, // En az 1 sezon olmalı

    },
    episodeNumber: {
        type: Number,
        required: true,
        min: 1, // En az 1 bölüm olmalı
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: false, // Bitiş tarihi zorunlu değil
        default: Date.now, // Eğer bitiş tarihi belirtilmezse, şu anki tarih kullanılır
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

const TvShow = mongoose.model("TVShow", tvshowSchema);
export default TvShow;
