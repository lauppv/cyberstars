import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  try {
    let runtimePath, srcFile, outputFile, dockerCmd;
    const langLower = language.toLowerCase();

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
      return res.json({ output: "Language not supported" });
    }

    exec(dockerCmd, { maxBuffer: 1024 * 1024 }, async (error) => {
      try {
        const output = await fs.readFile(outputFile, "utf-8");
        res.json({ output: output.trim() || "Programul nu a produs output." });
      } catch {
        res.json({ output: "Error connecting to server." });
      }
    });
  } catch {
    res.json({ output: "Error connecting to server." });
  }
});

export default router;
