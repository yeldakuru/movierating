import Movie from "../models/movie.model.js"

export const fetchMovies = async (req, res) => {
    try {
        const movies = await Movie.find();//mongoose hazır metodu
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movies" });
    }
}

export const fetchMovieById = async (req, res) => {
    try {//populate("comments")
        const movies = await Movie.findById(req.params.id);// params.id urldeki id parametresini alır
        if (!movies) return res.status(404).json({ message: "Movie not found" });// eğer film bulunamazsa 404 hatası döner
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie" });
    }
}
export const fetchHotMovies = async (req, res) => {
    try {
        const hotmovies = await Movie.find().sort({ averageRating: -1 }) // Sort by averageRating descending
            .limit(6);   // Fetch movies with average rating greater than 5
        res.json(hotmovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}