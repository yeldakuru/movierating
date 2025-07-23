import Comment from '../models/comments.model.js';
import Movie from '../models/movie.model.js';
import TvShow from '../models/tvshow.model.js';
import Likes from '../models/likes.model.js';

export const createComment = async (req, res) => {
    try {
        const { movieId, tvShowId, commentText } = req.body;

        if (commentText.length < 2 || commentText.length > 500) {
            return res.status(400).json({ message: 'Comment must be between 2 and 500 characters.' });
        }

        const newComment = new Comment({
            userId: req.user._id,//kullanıcı idsini al 
            movieId: movieId || undefined,
            tvShowId: tvShowId || undefined,
            commentText,
        });

        await newComment.save();

        if (movieId) {
            await Movie.findByIdAndUpdate(movieId, { $push: { comments: newComment._id } });//bu filmin idsini alır ve yeni yorumu bu filme ekler(movie deki comments arrayine ekler)
        } else if (tvShowId) {
            await TvShow.findByIdAndUpdate(tvShowId, { $push: { comments: newComment._id } });//push ekle ,pull çıkar
        }

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.commentText = req.body.commentText || comment.commentText;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.movieId) {
            await Movie.findByIdAndUpdate(comment.movieId, { $pull: { comments: comment._id } });
        } else if (comment.tvShowId) {
            await TvShow.findByIdAndUpdate(comment.tvShowId, { $pull: { comments: comment._id } });
        }

        await Likes.deleteMany({ commentId: comment._id });// tüm beğenileri sil
        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleLikeComment = async (req, res) => {
    try {
        const existingLike = await Likes.findOne({ userId: req.user._id, commentId: req.params.id });

        if (existingLike) {
            await Likes.findByIdAndDelete(existingLike._id);
            await Comment.findByIdAndUpdate(req.params.id, { $pull: { likes: existingLike._id } });
            return res.status(200).json({ message: 'Like removed' });
        } else {
            const newLike = new Likes({ userId: req.user._id, commentId: req.params.id });
            await newLike.save();
            await Comment.findByIdAndUpdate(req.params.id, { $push: { likes: newLike._id } });
            return res.status(201).json({ message: 'Like added' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET /api/comments/user/:userId
export const getCommentsByUser = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId })
            .populate('movieId')
            .populate('tvShowId');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/comments/movie/:movieId
export const getCommentsByMovie = async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.movieId }).populate('userId', '-password'); // dont fetch the password
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/comments/tvshow/:tvShowId
export const getCommentsByTvShow = async (req, res) => {
    try {
        const comments = await Comment.find({ tvShowId: req.params.tvShowId }).populate('userId', "-password -__v"); // dont fetch the password
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};