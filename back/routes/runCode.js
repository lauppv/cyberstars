import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  try {
    let runnerUrl;
    if (language.toLowerCase() === "python") runnerUrl = process.env.PYTHON_RUNNER_URL;
    else if (language.toLowerCase() === "c") runnerUrl = process.env.C_RUNNER_URL;
    else if (language.toLowerCase() === "java") runnerUrl = process.env.JAVA_RUNNER_URL;

    if (!runnerUrl) return res.json({ output: "Runner URL not configured" });

    const response = await fetch(runnerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    const data = await response.json();
    res.json({ output: data.output });

  } catch (err) {
    res.json({ output: `Eroare la execuție: ${err.message}` });
  }
});

export default router;
