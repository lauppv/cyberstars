import { spawn } from "child_process";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'


dotenv.config();



const reactProcess = spawn("node", ["src/react.js"], { stdio: "inherit" });

reactProcess.on("close", (code) => {
  console.log(`React process exited with code ${code}`);
});



const app = express();
app.use(cors());    
app.use(express.json());

app.use("/", authRoutes);



app.listen(process.env.EXPRESS_PORT, () => console.log(`API server running on http://localhost:${process.env.EXPRESS_PORT}`));
