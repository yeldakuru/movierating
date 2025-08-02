import Movie from '../models/movie.model.js';
import TvShow from '../models/tvshow.model.js';

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
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
        const {
            title,
            description,
            photo,
            genre,
            releaseDate,
            duration,
            trailerLink,
            director,
            cast,
        } = req.body;

        // Access the uploaded file (e.g. from multer middleware)
        // const imageFile = req.file;

        // const photo = imageFile ? await uploadToCloudinary(imageFile.path) : null;

        const newMovie = new Movie({
            title,
            description,
            photo, // Cloudinary URL
            genre,
            releaseDate,
            duration,
            trailerLink,
            director,
            cast,
        });

        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Movie
export const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Movie
export const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
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
            photo,
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
        //const imageFile = req.file;

        // const photo = imageFile ? await uploadToCloudinary(imageFile.path) : null;

        const newTvShow = new TvShow({
            title,
            description,
            photo, // Cloudinary URL
            genre,
            seasonNumber,
            episodeNumber,
            releaseDate,
            endDate,
            trailerLink,
            director,
            cast,
        });

        await newTvShow.save();
        res.status(201).json(newTvShow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update TV Show
export const updateTvShow = async (req, res) => {
    try {
        const updatedTvShow = await TvShow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTvShow) return res.status(404).json({ message: 'TV Show not found' });
        res.status(200).json(updatedTvShow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete TV Show
export const deleteTvShow = async (req, res) => {
    try {
        const deletedTvShow = await TvShow.findByIdAndDelete(req.params.id);
        if (!deletedTvShow) return res.status(404).json({ message: 'TV Show not found' });
        res.status(200).json({ message: 'TV Show deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};