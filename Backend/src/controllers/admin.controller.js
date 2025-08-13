import Movie from '../models/movie.model.js';
import TvShow from '../models/tvshow.model.js';
import cloudinary from '../lib/cloudinary.js';
import Comment from '../models/comments.model.js';
import path from 'path';

const uploadToCloudinary = async (filePath) => {
    try {
        const normalizedPath = path.resolve(filePath).replace(/\\/g, "/"); // Fix for Windows
        const result = await cloudinary.uploader.upload(normalizedPath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Error uploading to cloudinary");
    }
};

// Create Movie, to create without image, use the same endpoint but without the file upload add photo as a variable, comment out imageFile and photo

export const createMovie = async (req, res) => {
    try {

        // console.log("📦 BODY:", req.body);
        // console.log("🖼️ FILES:", req.files);

        const {
            title,
            description,
            genre,
            releaseDate,
            duration,
            trailerLink,
            director,
            cast,
        } = req.body;

        const imageFile = req.files?.photo;

        const photo = imageFile
            ? await uploadToCloudinary(imageFile.tempFilePath)
            : null;

        const parsedGenre = Array.isArray(genre) ? genre : [genre];
        const parsedCast = Array.isArray(cast) ? cast : [cast];

        const newMovie = new Movie({
            title,
            description,
            photo,
            genre: parsedGenre,
            releaseDate,
            duration,
            trailerLink,
            director,
            cast: parsedCast,
        });

        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("❌ CREATE MOVIE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            releaseDate,
            duration,
            trailerLink,
            director,
            genre,
            cast,
        } = req.body;

        const imageFile = req.files?.photo;

        let photo;
        if (imageFile) {
            photo = await uploadToCloudinary(imageFile.tempFilePath);
        }

        const parsedGenre = Array.isArray(genre) ? genre : [genre];
        const parsedCast = Array.isArray(cast) ? cast : [cast];

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                releaseDate,
                duration,
                trailerLink,
                director,
                genre: parsedGenre,
                cast: parsedCast,
                ...(photo && { photo }), // Only include photo if uploaded
            },
            { new: true }
        );

        if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });

        res.status(200).json(updatedMovie);
    } catch (error) {
        console.error("Update Movie Error:", error);
        res.status(500).json({ message: error.message });
    }
};


// Delete Movie
export const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });

        // delete related comments
        await Comment.deleteMany({ movieId: req.params.id });

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create TV Show
export const createTvShow = async (req, res) => {
    try {
        const {
            title,
            description,
            genre,
            seasonNumber,
            episodeNumber,
            releaseDate,
            endDate,
            trailerLink,
            director,
            cast,
        } = req.body;

        // Access the uploaded file (e.g. from multer middleware)
        const imageFile = req.files?.photo;

        const photo = imageFile
            ? await uploadToCloudinary(imageFile.tempFilePath)
            : null;

        const parsedGenre = Array.isArray(genre) ? genre : [genre];
        const parsedCast = Array.isArray(cast) ? cast : [cast];

        const newTvShow = new TvShow({
            title,
            description,
            photo, // Cloudinary URL
            genre: parsedGenre,
            seasonNumber,
            episodeNumber,
            releaseDate,
            endDate,
            trailerLink,
            director,
            cast: parsedCast,
        });

        await newTvShow.save();
        res.status(201).json(newTvShow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTvShow = async (req, res) => {
    try {
        const {
            title,
            description,
            releaseDate,
            endDate,
            trailerLink,
            director,
            genre,
            cast,
            seasonNumber,
            episodeNumber,
        } = req.body;

        const imageFile = req.files?.photo;
        let photo;
        if (imageFile) {
            photo = await uploadToCloudinary(imageFile.tempFilePath);
        }

        const parsedGenre = Array.isArray(genre) ? genre : [genre];
        const parsedCast = Array.isArray(cast) ? cast : [cast];

        const updatedTvShow = await TvShow.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                releaseDate,
                endDate,
                trailerLink,
                director,
                genre: parsedGenre,
                cast: parsedCast,
                seasonNumber,
                episodeNumber,
                ...(photo && { photo }),
            },
            { new: true }
        );

        if (!updatedTvShow) return res.status(404).json({ message: "TV Show not found" });

        res.status(200).json(updatedTvShow);
    } catch (error) {
        console.error("Update TV Show Error:", error);
        res.status(500).json({ message: error.message });
    }
};



// Delete TV Show
export const deleteTvShow = async (req, res) => {
    try {
        const deletedTvShow = await TvShow.findByIdAndDelete(req.params.id);
        if (!deletedTvShow) return res.status(404).json({ message: 'TV Show not found' });

        // delete related comments
        await Comment.deleteMany({ tvShowId: req.params.id });

        res.status(200).json({ message: 'TV Show deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};