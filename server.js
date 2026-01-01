import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app =express();

app.use(cors({
     origin: 'http://localhost:5173', // frontend origin
  credentials: true,  
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use('/api/auth',authRoutes);
app.use('/api/customer',customerRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/reports',reportRoutes);
app.use('/api/users',userRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected!"))
.catch((error)=>console.error(error))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on ${PORT}`))