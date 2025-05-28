import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },

    profilePic: {
        type: String,
        default: "",
    },

}, { timestamps: true } // createdAt ve updatedAt alanlarını otomatik olarak ekler
);

userSchema.methods.comparePassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};
const User = mongoose.model('User', userSchema);
export default User;