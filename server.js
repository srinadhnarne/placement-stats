import express from 'express'
import authRoutes from './routes/authRoutes.js'
import dataRoutes from './routes/dataRoutes.js'
import ConnectDB from './mongodb.js';
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'


dotenv.config();

ConnectDB();
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/v1/eceplacements/auth',authRoutes);

app.use('/api/v1/eceplacements/data',dataRoutes);

const PORT = process.env.PORT||8000
app.listen(PORT,()=>{
    console.log(`Server connected to Port ${PORT}`)
})