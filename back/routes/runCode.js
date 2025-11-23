import { spawn } from 'child_process';
import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post("/run-code", (req, res) => {
  const { code } = req.body;

  const tempDir = path.join(process.cwd(), 'back', 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const tempFile = path.join(tempDir, "user_code.c");
  fs.writeFileSync(tempFile, code);

  const dockerProcess = spawn("docker", [
    "run",
    "--rm",
    "-v", `${tempFile}:/usr/src/app/user_code.c`,
    "code-runner",
    "sh",
    "-c",
    "./run_code.sh user_code.c"
  ]);

  let output = "";
  dockerProcess.stdout.on("data", data => output += data.toString());
  dockerProcess.stderr.on("data", data => output += data.toString());

  dockerProcess.on("close", () => {
    fs.unlinkSync(tempFile);
    res.json({ output });
  });
});

export default router;
