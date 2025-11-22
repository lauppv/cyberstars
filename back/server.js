import { spawn } from "child_process";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import authenticateToken from "./middleware/authToken.js";
import cookieParser from "cookie-parser";


dotenv.config();

const reactProcess = spawn("node", ["src/react.js"], { stdio: "inherit" });

reactProcess.on("close", (code) => {
  console.log(`React process exited with code ${code}`);
});

const app = express();
app.use(cors({
  origin: "http://localhost:1212", // sau portul frontend
  credentials: true,
}));

app.use(express.json());

// 1️⃣ Endpoint-uri publice: signup și login
app.use(cookieParser());
app.use("/auth", authRoutes);

// 2️⃣ Endpoint-uri protejate: doar după ce utilizatorul are token
const protectedRouter = express.Router();
protectedRouter.use(authenticateToken);

protectedRouter.get("/dashboard", (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

app.use("/api", protectedRouter);

// 3️⃣ Pornim serverul
app.listen(process.env.EXPRESS_PORT, () => 
  console.log(`API server running on http://localhost:${process.env.EXPRESS_PORT}`)
);
