import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {config} from 'dotenv';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/db.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

// Initialize Express App
const app = express();

// Load environment variables
config({
    path :"./config/config.env"
});

// CORS Configuration
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
}));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);

// Database Connection
dbConnection();

export default app;