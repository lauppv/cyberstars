import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";
import fetch from "node-fetch"; // dacă folosești Node < 18

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

// URL-ul public al Piston (poți schimba cu self-hosted dacă vrei)
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

router.post("/", async (req, res) => {
  const { code, language } = req.body;
  const langLower = language.toLowerCase();

  if (isProduction) {
    // -----------------------
    // PRODUCTION: folosim Piston
    // -----------------------
    try {
      const response = await fetch(PISTON_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: langLower,
          source: code,
        }),
      });
      const data = await response.json();
      res.json({ output: data.output || "Programul nu a produs output." });
    } catch (err) {
      console.error(err);
      res.json({ output: "Error connecting to execution server." });
    }
  } else {
    // -----------------------
    // DEVELOPMENT: folosim Docker
    // -----------------------
    try {
      let runtimePath, srcFile, outputFile, dockerCmd;

      if (langLower === "python") {
        runtimePath = path.join(process.cwd(), "back", "runtimes", "python");
        await fs.mkdir(runtimePath, { recursive: true });

        srcFile = path.join(runtimePath, "user_code.py");
        outputFile = path.join(runtimePath, "output.txt");

        await fs.writeFile(srcFile, code, "utf-8");
        await fs.writeFile(outputFile, "", "utf-8");

        dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app python-runtime sh -c "
timeout 5 python3 /usr/src/app/user_code.py > /usr/src/app/output.txt 2>&1
"`;

      } else if (langLower === "c") {
        runtimePath = path.join(process.cwd(), "back", "runtimes", "c");
        await fs.mkdir(runtimePath, { recursive: true });

        srcFile = path.join(runtimePath, "user_code.c");
        outputFile = path.join(runtimePath, "output.txt");

        await fs.writeFile(srcFile, code, "utf-8");
        await fs.writeFile(outputFile, "", "utf-8");

        dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app gcc:12.2.0 bash -c "
timeout 5 bash -c 'gcc /usr/src/app/user_code.c -o /usr/src/app/a.out > /usr/src/app/output.txt 2>&1 && /usr/src/app/a.out >> /usr/src/app/output.txt 2>&1'
"`;

      } else if (langLower === "java") {
        runtimePath = path.join(process.cwd(), "back", "runtimes", "java");
        await fs.mkdir(runtimePath, { recursive: true });

        srcFile = path.join(runtimePath, "Main.java");
        outputFile = path.join(runtimePath, "output.txt");

        await fs.writeFile(srcFile, code, "utf-8");
        await fs.writeFile(outputFile, "", "utf-8");

        dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app openjdk:20 bash -c "
timeout 5 bash -c 'javac /usr/src/app/Main.java -d /usr/src/app > /usr/src/app/output.txt 2>&1 && java -cp /usr/src/app Main >> /usr/src/app/output.txt 2>&1'
"`;

      } else {
        return res.json({ output: "Language not supported in development." });
      }

      exec(dockerCmd, { maxBuffer: 1024 * 1024 }, async (error) => {
        try {
          const output = await fs.readFile(outputFile, "utf-8");
          res.json({ output: output.trim() || "Programul nu a produs output." });
        } catch (err) {
          console.error(err);
          res.json({ output: "Error reading output file." });
        }
      });
    } catch (err) {
      console.error(err);
      res.json({ output: "Error running code." });
    }
  }
});

export default router;
