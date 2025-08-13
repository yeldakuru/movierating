import Movie from "../models/movie.model.js"

export const fetchMovies = async (req, res) => {
    try {
        const movies = await Movie.find(); // .populate("comments") later to include comments, instead of id it will return the full comment object
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id); // .populate("comments") later to include comments, instead of id it will return the full comment object
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchHotMovies = async (req, res) => {
    try {
        const hotMovies = await Movie.find().sort({ averageRating: -1 }) // Sort by averageRating descending
            .limit(6);   // Fetch movies with average rating greater than 5
        res.json(hotMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};