import { spawn } from "child_process";
import express from "express";

// porneste build-erul
const reactProcess = spawn("node", ["src/react.js"], { stdio: "inherit" });

reactProcess.on("close", (code) => {
  console.log(`React process exited with code ${code}`);
});



const app = express();
const PORT = 3000;

app.use(express.json());


app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
