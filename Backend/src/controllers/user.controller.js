import User from "../models/user.model.js";
import { generateToken } from "../lib/token.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists" });

        const newUser = new User({
            username,
            email,
            password,
        });

        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    // res.send("Login route is working"); // Send a response when the root route is accessed 

    const { email, password } = req.body; // Destructure email and password from the request body

    try {
        const user = await User.findOne({ email }); // Find the user in the database by email

        if (!user) {
            return res.status(404).json({ message: "User not found!!" }); // Send a 404 response if the user is not found
        }

        const isMatch = await user.comparePassword(password); // Compare the provided password with the hashed password in the database
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" }); // Send a 400 response if the password does not match
        }

        generateToken(user._id, res); // Generate a token for the user and send it in the response
        return res.status(200).json({ message: "Login successful", user }); // Send a 200 response if the login is successful

    } catch (error) {
        res.status(500).json({ message: "Internal server error!!" }); // Send a 500 response if an error occurs
        console.error("Error finding user:", error); // Log the error to the console
    }
};

export const logout = async (req, res) => {
    // res.send("logout route is working"); // Send a response when the root route is accessed

    try {
        res.clearCookie("token", { // Clear the token cookie from the response
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({ message: "Logout successful" }); // Send a 200 response if the logout is successful
    } catch (error) {
        res.status(500).json({ message: "Internal server error!!!!" }); // Send a 500 response if an error occurs
        console.error("Error logging out:", error); // Log the error to the console
    }
};
