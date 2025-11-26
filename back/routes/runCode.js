// runCode.js
import { spawn } from "child_process";
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", (req, res) => {
  const { code, language } = req.body;
  const runtimePath = path.join(process.cwd(), `back/runtimes/${language}`);
  const tempFile = path.join(runtimePath, `user_code.${getExtension(language)}`);

  // Scriem codul într-un fișier temporar
  fs.writeFileSync(tempFile, code);

  // Pornim Docker-ul cu limite de resurse și timp
  const dockerProcess = spawn("docker", [
    "run",
    "--rm",
    "-v", `${runtimePath}:/usr/src/app`,
    "--memory=100m",      // limită memorie 100MB
    "--cpus=0.5",         // folosim maxim jumătate de CPU
    `${language}-run`,
    "timeout", "5s",      // timeout de 5 secunde
    "./run_code.sh",
    `user_code.${getExtension(language)}`
  ]);

  let output = "";

  dockerProcess.stdout.on("data", (data) => output += data.toString());
  dockerProcess.stderr.on("data", (data) => output += data.toString());

  dockerProcess.on("close", (code, signal) => {
    if (signal === "SIGTERM" || code === 124) {
      // 124 este codul de ieșire pentru `timeout`
      res.json({ output: "You have entered an infinite loop, meaning your code would have run forever. Don’t worry, we stopped the execution of your program :) Give it another try. You're getting there!" });
    } else {
      res.json({ output });
    }
  });

  dockerProcess.on("error", (err) => {
    res.json({ output: `Eroare la execuție: ${err.message}` });
  });
});

function getExtension(language) {
  switch(language.toLowerCase()) {
    case "python": return "py";
    case "c": return "c";
    case "java": return "java";
    default: return "txt";
  }
}

export default router;
