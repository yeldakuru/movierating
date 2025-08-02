import TvShow from "../models/tvshow.model.js";

export const fetchTvShows = async (req, res) => {
    try {
        const tvShows = await TvShow.find(); // Fetch all TV shows
        res.status(200).json(tvShows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching TV shows" });
    }
};

export const fetchTvShowById = async (req, res) => {
    try {
        const tvShow = await TvShow.findById(req.params.id); // params.id gets the id from the URL
        if (!tvShow) return res.status(404).json({ message: "TV Show not found" });
        res.status(200).json(tvShow);
    } catch (error) {
        res.status(500).json({ message: "Error fetching TV show" });
    }
};
export const fetchHotTvShows = async (req, res) => {
    try {
        const hotTvShows = await TvShow.find().sort({ averageRating: -1 }) // Sort by averageRating descending
            .limit(6);   // Fetch TV shows with average rating greater than 5
        res.json(hotTvShows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};