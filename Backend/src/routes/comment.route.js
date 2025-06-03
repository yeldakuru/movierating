// 📁 routes/commentRoutes.js
import express from 'express';
import { userLoggedIn, isCommentOwnerOrAdmin } from "../middleware/checkUserMiddleware.js";
import { createComment, updateComment, deleteComment, toggleLikeComment, getCommentsByUser, getCommentsByMovie, getCommentsByTvShow } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/', userLoggedIn, createComment);
router.put('/:id', userLoggedIn, isCommentOwnerOrAdmin, updateComment);
router.delete('/:id', userLoggedIn, isCommentOwnerOrAdmin, deleteComment);
router.post('/:id/like', userLoggedIn, toggleLikeComment);

// route to fetch comments that belongs to a specific user
router.get('/user/:userId', getCommentsByUser);
// route to fetch comments that belongs to a specific movie 
router.get('/movie/:movieId', getCommentsByMovie);
// route to fetch comments that belongs to a specific TV show
router.get('/tvshow/:tvShowId', getCommentsByTvShow);

export default router;