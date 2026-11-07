Chapter 3 gave you the file-inspection toolkit. Each command answers a different
question:

| Command | Answers                                |
| ------- | -------------------------------------- |
| `cat`   | "Show me the whole (short) file."      |
| `head`  | "Show me the _start_."                 |
| `tail`  | "Show me the _latest_ events."         |
| `less`  | "Let me _scroll_ through a long file." |
| `wc`    | "How big is it, how many lines/words?" |

A common workflow when inspecting logs: `wc -l` to size the file, `head` to see how it
begins, `tail` to see the newest entries.

---

## Mission: Station Log Triage

The previous crew evacuated in a hurry and left three logs behind. Before anyone moves back in, command wants answers:

- What does the short `summary.log` say? Read all of it.
- How did the day in `events.log` begin, and how did it end? Three events from each end, nothing from the middle.
- How many errors were logged in `errors.log`, one per line? The number, not the errors.

**Expected result**

You can answer all three questions from what you saw.
