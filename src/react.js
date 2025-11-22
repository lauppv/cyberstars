import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.json())



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(process.env.REACT_PORT, () => console.log(`React server running on http://localhost:${process.env.REACT_PORT}`));
