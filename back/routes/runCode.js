import express from "express";


const router = express.Router();

router.post("/", async (req, res) => {
  const { code } = req.body;

  try {
    const pythonServiceURL = process.env.PYTHON_RUNNER_URL;
    if (!pythonServiceURL) throw new Error("PYTHON_RUNNER_URL nu e setat!");

    const response = await fetch(pythonServiceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    res.json({ output: data.output });
  } catch (err) {
    res.json({ output: `Eroare la execuție: ${err.message}` });
  }
});

export default router;
