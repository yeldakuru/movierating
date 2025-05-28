import express from 'express';
import { userLoggedIn } from '../middleware/checkUserMiddleware.js';
import { register, login, logout, checkUser, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();//router adında bir express router nesnesi oluşturuyoruz

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.put("/profileUpdate", userLoggedIn, updateProfile);

router.get("/checkUser", userLoggedIn, checkUser);


export default router;
