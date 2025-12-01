import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  try {
    let runtimePath, dockerCmd;

    if (language.toLowerCase() === "python") {
      runtimePath = path.join(process.cwd(), "back", "runtimes", "python");
      await fs.writeFile(path.join(runtimePath, "user_code.py"), code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app python:3.10-slim python /usr/src/app/user_code.py`;
    } 
    else if (language.toLowerCase() === "c") {
      runtimePath = path.join(process.cwd(), "back", "runtimes", "c");
      await fs.writeFile(path.join(runtimePath, "user_code.c"), code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app gcc:12.2.0 bash -c "gcc /usr/src/app/user_code.c -o /usr/src/app/a.out && /usr/src/app/a.out"`;
    } 
    else if (language.toLowerCase() === "java") {
      runtimePath = path.join(process.cwd(), "back", "runtimes", "java");
      await fs.writeFile(path.join(runtimePath, "Main.java"), code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app openjdk:20 bash -c "javac /usr/src/app/Main.java && java -cp /usr/src/app Main"`;
    } 
    else {
      return res.json({ output: "Language not supported" });
    }

    exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        return res.json({ output: stderr || error.message });
      }
      res.json({ output: stdout });
    });

  } catch (err) {
    res.json({ output: `Eroare la execuție: ${err.message}` });
  }
});

export default router;
