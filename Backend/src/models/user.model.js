import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    }
}, { timestamps: true });

// 🔑 Add comparePassword method to schema
// 🔓 Compare plain-text password directly
userSchema.methods.comparePassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

const User = mongoose.model("User", userSchema); // Create a model named "User" using the userSchema
export default User; // Export the User model for use in other parts of the application