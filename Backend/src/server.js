import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/database.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import movieRoutes from './routes/movies.route.js';
import tvShowRoutes from './routes/tvshows.route.js';
import commentRoutes from './routes/comment.route.js';
import likeRoutes from './routes/like.route.js';
import ratingRoutes from './routes/rate.route.js';



dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());//json dosyası olarak açmak için
app.use(cookieParser());//
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tvshows", tvShowRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/ratings", ratingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // MongoDB bağlantısını başlat
});
