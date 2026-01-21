import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'ConvoHubDB'
    }).then(() => {
        console.log("MongoDB connected successfully.");
    }).catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }); 
}