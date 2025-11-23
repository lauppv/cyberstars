import { spawn } from "child_process";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import authenticateToken from "./middleware/authToken.js";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import runCodeRouter from "./routes/runCode.js";
import { exec } from "child_process";

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
app.use("/lesson-code", express.static(path.join(process.cwd(), "back", "lessons")));

// 2️⃣ Endpoint-uri protejate: doar după ce utilizatorul are token
const protectedRouter = express.Router();
protectedRouter.use(authenticateToken);

protectedRouter.get("/dashboard", (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

app.use("/api", protectedRouter);
app.use('/api', runCodeRouter);

app.get("/lessons/:lang/:lesson", (req, res) => {
	const { lang, lesson } = req.params;

	const filePath = path.join(
		process.cwd(),
		"back",
		"lessons",
		lang,
		`${lesson}.md`
	);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: "Lesson not found" });
	}

	const content = fs.readFileSync(filePath, "utf-8");
  	res.json({ title: lesson, content });
});

app.post("/run-code", (req, res) => {
	const { code } = req.body; // codul C de la frontend
	const tempFile = path.join(process.cwd(), "user_code.c");

	// Salvează codul într-un fișier temporar
	fs.writeFileSync(tempFile, code);

	// Rulează codul în Docker
	exec(
		`docker run --rm -v ${process.cwd()}:/usr/src/app code-runner ./run_code.sh user_code.c`,
		(error, stdout, stderr) => {
		if (error) {
			return res.json({ output: stderr });
		}
		res.json({ output: stdout });
		}
	);
});


// 3️⃣ Pornim serverul
app.listen(process.env.EXPRESS_PORT, () => 
  console.log(`API server running on http://localhost:${process.env.EXPRESS_PORT}`)
);
