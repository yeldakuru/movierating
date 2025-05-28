import express from 'express';
import { userLoggedIn } from '../middleware/checkUserMiddleware.js';
import { register, login, logout } from '../controllers/user.controller.js';
const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

// router.put("/profileUpdate", userLoggedIn, profile);

// router.get("/checkUser", userLoggedIn, checkUser);


export default router;
