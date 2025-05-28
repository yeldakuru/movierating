import mongoose from 'mongoose';

export const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    }
    catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
}