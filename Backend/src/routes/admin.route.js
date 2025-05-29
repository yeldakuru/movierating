import express from 'express';
import { adminOnly, userLoggedIn } from '../middleware/checkUserMiddleware.js';
import {
    createMovie,
    updateMovie,
    deleteMovie,
    createTvShow,
    updateTvShow,
    deleteTvShow
} from '../controllers/admin.controller.js';

const router = express.Router();
router.use(userLoggedIn, adminOnly);//alttaki tum route'lara erişmeden önce kullanıcı giriş yapmış mı ve admin mi kontrolü yapılıyor.hepsine yazmaktansa ustte tanımladık

router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);


router.post('/tvshows', createTvShow);
router.put('/tvshows/:id', updateTvShow);
router.delete('/tvshows/:id', deleteTvShow);

export default router;
