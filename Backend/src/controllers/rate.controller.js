import Rate from '../models/rate.model.js';
import Movie from '../models/movie.model.js';
import TvShow from '../models/tvshow.model.js';

const updateMovieRatingStats = async (movieId) => {
    const ratings = await Rate.find({ movieId });
    const ratingsCount = ratings.length;
    const averageRating = ratingsCount > 0
        ? ratings.reduce((acc, r) => acc + r.rate, 0) / ratingsCount
        : 0;

    await Movie.findByIdAndUpdate(movieId, {
        averageRating: Number(averageRating.toFixed(1)),
        ratingsCount,
    });
};

const updateTvShowRatingStats = async (tvShowId) => {
    const ratings = await Rate.find({ tvShowId });
    const ratingsCount = ratings.length;
    const averageRating = ratingsCount > 0
        ? ratings.reduce((acc, r) => acc + r.rate, 0) / ratingsCount
        : 0;

    await TvShow.findByIdAndUpdate(tvShowId, {
        averageRating: Number(averageRating.toFixed(1)),
        ratingsCount,
    });
};

export const createRating = async (req, res) => {
    try {
        const { movieId, tvShowId, rate } = req.body;

        const existing = await Rate.findOne({
            userId: req.user._id,
            ...(movieId ? { movieId } : {}),
            ...(tvShowId ? { tvShowId } : {}),
        });

        if (existing) {
            return res.status(400).json({ message: 'Rating already exists. Use PUT to update.' });
        }

        const newRating = new Rate({
            userId: req.user._id,
            movieId: movieId || undefined,
            tvShowId: tvShowId || undefined,
            rate,
        });

        await newRating.save();

        if (movieId) await updateMovieRatingStats(movieId);
        if (tvShowId) await updateTvShowRatingStats(tvShowId);

        res.status(201).json({ message: 'Rating created', rating: newRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rate } = req.body;

        const rating = await Rate.findById(id);
        if (!rating) return res.status(404).json({ message: 'Rating not found' });
        if (rating.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        rating.rate = rate;
        await rating.save();

        if (rating.movieId) await updateMovieRatingStats(rating.movieId);
        if (rating.tvShowId) await updateTvShowRatingStats(rating.tvShowId);

        res.status(200).json({ message: 'Rating updated', rating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const rating = await Rate.findById(id);
        if (!rating) return res.status(404).json({ message: 'Rating not found' });
        if (rating.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const movieId = rating.movieId;
        const tvShowId = rating.tvShowId;
        await rating.deleteOne();

        if (movieId) await updateMovieRatingStats(movieId);
        if (tvShowId) await updateTvShowRatingStats(tvShowId);

        res.status(200).json({ message: 'Rating deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRatingsByUser = async (req, res) => {
    try {
        const ratings = await Rate.find({ userId: req.params.userId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRatingsForMovie = async (req, res) => {
    try {
        const ratings = await Rate.find({ movieId: req.params.movieId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRatingsForTvShow = async (req, res) => {
    try {
        const ratings = await Rate.find({ tvShowId: req.params.tvShowId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};