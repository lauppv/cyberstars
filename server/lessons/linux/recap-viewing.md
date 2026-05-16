Chapter 3 gave you the file-inspection toolkit. Each command answers a different
question:

| Command | Answers |
|---------|---------|
| `cat` | "Show me the whole (short) file." |
| `head` | "Show me the *start*." |
| `tail` | "Show me the *latest* events." |
| `less` | "Let me *scroll* through a long file." |
| `wc` | "How big is it — how many lines/words?" |

A common workflow when inspecting logs: `wc -l` to size the file, `head` to see how it
begins, `tail` to see the newest entries.

---

The station left behind three log files. In your home directory:

1. Use `cat` to read the short file `summary.log` in full.
2. Use `head -n 3` to view the **first 3 lines** of `events.log`.
3. Use `tail -n 3` to view the **last 3 lines** of `events.log`.
4. Use `wc -l` to count the lines in `errors.log`.

This is how you triage logs on a real system — measure, then peek at both ends.
