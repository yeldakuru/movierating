import express from 'express';
import { fetchMovies, fetchMovieById, fetchHotMovies } from '../controllers/movies.controller.js';
const router = express.Router();

router.get("/", fetchMovies);
router.get("/:id", fetchMovieById);
router.get("/hotmovies", fetchHotMovies);

export default router;