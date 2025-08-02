import express from 'express';
import { fetchMovies, fetchMovieById, fetchHotMovies } from '../controllers/movies.controller.js';
const router = express.Router();

router.get("/", fetchMovies);
router.get("/hotmovies", fetchHotMovies);
router.get("/:id", fetchMovieById);


export default router;