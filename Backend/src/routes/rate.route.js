import express from 'express';
import { userLoggedIn } from '../middleware/checkUserMiddleware.js';
import {
    createRating,
    updateRating,
    deleteRating,
    getRatingsByUser,
    getRatingsForMovie,
    getRatingsForTvShow,
} from '../controllers/rate.controller.js';

const router = express.Router();

router.post('/', userLoggedIn, createRating);
router.put('/:id', userLoggedIn, updateRating);
router.delete('/:id', userLoggedIn, deleteRating);
router.get('/user/:userId', getRatingsByUser);
router.get('/movie/:movieId', getRatingsForMovie);
router.get('/tv/:tvShowId', getRatingsForTvShow);

export default router;