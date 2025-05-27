import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/database.js';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());//json dosyası olarak açmak için
app.use(cookieParser());//
app.use(express.urlencoded({ extended: true }));




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // MongoDB bağlantısını başlat
});
