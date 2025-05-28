import express from 'express';
import { userLoggedIn } from '../middlewares/checkUserMiddleware.js';
const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.put("/profileUpdate", userLoggedIn, profile);

router.get("/checkUser", userLoggedIn, checkUser);


export default router;
