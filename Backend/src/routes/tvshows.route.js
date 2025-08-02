import express from 'express';
import { fetchTvShows, fetchTvShowById, fetchHotTvShows } from "../controllers/tvshows.controller.js";

const router = express.Router();

router.get("/", fetchTvShows);
router.get("/hottvshows", fetchHotTvShows);
router.get("/:id", fetchTvShowById);

export default router;