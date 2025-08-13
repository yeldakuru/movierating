import TvShow from "../models/tvshow.model.js";

export const fetchTvShows = async (req, res) => {
    try {
        const tvshow = await TvShow.find(); // .populate("comments") later to include comments, instead of id it will return the full comment object
        res.json(tvshow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchTvShowById = async (req, res) => {
    try {
        const tvshow = await TvShow.findById(req.params.id); // .populate("comments") later to include comments, instead of id it will return the full comment object
        if (!tvshow) return res.status(404).json({ message: "Movie not found" });
        res.json(tvshow);
    } catch (error) {
        res.status(500).json({ message: error.message });
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