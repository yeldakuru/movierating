import express from 'express';
import { fetchTvShows, fetchTvShowById } from '../controllers/tvshows.controller.js';
const router = express.Router();

router.get("/", fetchTvShows);
router.get("/:id", fetchTvShowById);
export default router;