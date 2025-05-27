import mongoose from "mongoose";
//	.env dosyasındaki MONGODB_URI adresi ile MongoDB’ye bağlanmaya çalışır.
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)//	Bağlantı sağlandığında bağlı olunan sunucunun adresini log’lar.
    } catch (error) {
        console.log("MongoDB connection error:", error)
    }
};