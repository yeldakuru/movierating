import User from "../models/user.model.js";
import { generateToken } from "../lib/token.js";
import cloudinary from "../lib/cloudinary.js";


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

        if (newUser) {//kullanıcı oluşturulduysa token oluştur
            // generate jwt token here
            generateToken(newUser._id, res);// generateToken fonksiyonunu çağırarak token oluştur
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

        const isMatch = await user.comparePassword(password); // şifreyi dbdeki kullanıcı şifresiyle karşılaştır
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" }); // Send a 400 response if the password does not match
        }

        generateToken(user._id, res); //Kullanıcı için bir token oluşturun ve yanıt olarak gönderin
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
            httpOnly: true,// HTTP üzerinden erişilebilir, JavaScript tarafından erişilemez
            secure: true,//yalnızca HTTPS üzerinden gönderilir
            sameSite: "none",//farklı alan adlarından gelen isteklerde kullanılabilir
        });

        return res.status(200).json({ message: "Logout successful" }); // Send a 200 response if the logout is successful
    } catch (error) {
        res.status(500).json({ message: "Internal server error!!!!" }); // Send a 500 response if an error occurs
        console.error("Error logging out:", error); // Log the error to the console
    }
};

export const checkUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.status(200).json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profilePic: req.user.profilePic,
        });
    } catch (error) {
        console.error("Error in checkUser controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {//ismi ve profil resmini güncellemek için
        const { username, profilePic } = req.body;
        const userId = req.user._id;

        const updateFields = {};//onaylandığında güncellenecek obje 

        // Handle username
        if (username) {
            if (username.trim() === "") {
                return res.status(400).json({ message: "Username cannot be empty" });
            }
            updateFields.username = username;
        }

        // Handle profilePic
        if (profilePic) {
            if (typeof profilePic !== "string" || profilePic.trim() === "") {
                return res
                    .status(400)
                    .json({ message: "Profile picture is invalid or empty" });
            }

            const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                folder: "profile_pics",
            });
            updateFields.profilePic = uploadResponse.secure_url;
        }

        // If nothing is provided
        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({ message: "No data provided for update" });
        }

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
            new: true,
        }).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
