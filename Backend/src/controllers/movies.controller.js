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
    try {
        const movie = await Movie.findById(req.params.id);// params.id urldeki id parametresini alır
        if (!movie) return res.status(404).json({ message: "Movie not found" });// eğer film bulunamazsa 404 hatası döner
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie" });
    }
}
