import express from 'express';

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.put("/profileUpdate", profile);

router.get("/checkUser", checkUser);


export default router;
