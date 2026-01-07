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
import activityRoutes from './routes/activityRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
dotenv.config();

const app =express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://crm-admin-mpcd.vercel.app',
];


app.use(cors({
     origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

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
app.use('/api/activity',activityRoutes);
app.use('/api/dashboard',dashboardRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected!"))
.catch((error)=>console.error(error))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on ${PORT}`))