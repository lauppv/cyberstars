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
      await fs.mkdir(runtimePath, { recursive: true });
      await fs.writeFile(path.join(runtimePath, "user_code.py"), code, "utf-8");

      // Rulează codul Python în containerul python-runtime cu scriptul run_code.sh
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app python-runtime sh /usr/src/app/run_code.sh /usr/src/app/user_code.py`;

    } else if (language.toLowerCase() === "c") {
      runtimePath = path.join(process.cwd(), "back", "runtimes", "c");
      await fs.mkdir(runtimePath, { recursive: true });
      await fs.writeFile(path.join(runtimePath, "user_code.c"), code, "utf-8");

      // Timeout 5s în container
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app gcc:12.2.0 bash -c "timeout 5 bash -c 'gcc /usr/src/app/user_code.c -o /usr/src/app/a.out && /usr/src/app/a.out'"`;

    } else if (language.toLowerCase() === "java") {
      runtimePath = path.join(process.cwd(), "back", "runtimes", "java");
      await fs.mkdir(runtimePath, { recursive: true });
      await fs.writeFile(path.join(runtimePath, "Main.java"), code, "utf-8");

      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app openjdk:20 bash -c "timeout 5 bash -c 'javac /usr/src/app/Main.java && java -cp /usr/src/app Main'"`;

    } else {
      return res.json({ output: "Language not supported" });
    }

   exec(dockerCmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
  if (error) {
    const combinedOutput = (stdout ? stdout : "") + (stderr ? stderr : "");
    return res.json({ output: combinedOutput || error.message });
  }
  res.json({ output: stdout || stderr || "Programul nu a produs output." });
});

  } catch (err) {
    res.json({ output: `Eroare la execuție: ${err.message}` });
  }
});

export default router;
