import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/lessons/:lang/:lesson", (req, res) => {
  const { lang, lesson } = req.params;
  const filePath = path.join(process.cwd(), "back", "lessons", lang, `${lesson}.md`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.json({ title: lesson, content });
});

router.get("/lesson-code/:lang/:file", (req, res) => {
  const { lang, file } = req.params;
  const filePath = path.join(process.cwd(), "back", "lessons", lang, file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Code file not found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.type("text/plain").send(content);
});

export default router;
