import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language } = req.body;

  try {
    // Alege URL-ul runner-ului în funcție de limbaj
    let runnerUrl;
    if (language.toLowerCase() === "python") runnerUrl = process.env.PYTHON_RUNNER_URL;
    else if (language.toLowerCase() === "c") runnerUrl = process.env.C_RUNNER_URL;
    else if (language.toLowerCase() === "java") runnerUrl = process.env.JAVA_RUNNER_URL;

    if (!runnerUrl) return res.json({ output: "Runner URL not configured" });

    console.log("Sending code to runner at:", runnerUrl);

    // Trimite codul către runner
    const response = await fetch(runnerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    // Parsează răspunsul JSON
    const data = await response.json();
    console.log("Received from runner:", data);

    // Trimite output-ul la frontend
    res.json({ output: data.output || "No output received" });

  } catch (err) {
    console.error("Error contacting runner:", err);
    res.json({ output: `Eroare la execuție: ${err.message}` });
  }
});

export default router;
