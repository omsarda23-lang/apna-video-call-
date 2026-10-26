
import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);

// Port configuration
const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start the server
async function start() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from the .env file");
        }

        const connectionDb = await mongoose.connect(
            process.env.MONGO_URI,
            { dbName: "zoom_db" }
        );

        console.log(
            `MongoDB connected successfully: ${connectionDb.connection.host}`
        );

        // Initialize Socket.IO after the database connects
        connectToSocket(server);

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

start();
