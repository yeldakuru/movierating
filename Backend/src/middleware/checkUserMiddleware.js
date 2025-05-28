import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

import dotenv from "dotenv";
dotenv.config();

export const adminOnly = (req, res, next) => {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!req.user || req.user.email !== adminEmail) {//eğer kullanıcı yoksa veya kullanıcının emaili admin emailiyle eşleşmiyorsa
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();//sıradaki fonksiyona geç
};

export const userLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Get the token from the cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" }); // Send a 401 response if the token is not found
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized Token!!" }); // Send a 401 response if the token is invalid
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find the user in the database by ID and return values excluding the password

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // Send a 404 response if the user is not found
        }

        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware function

    } catch (error) {
        res.status(500).json({ message: "Unauthorized !!" }); // Send a 401 response if an error occurs
        console.error("Error in authMiddleware:", error); // Log the error to the console
    }
};

