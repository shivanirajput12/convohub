import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {config} from 'dotenv';
import fileUpload from 'express-fileupload';

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


export default app;