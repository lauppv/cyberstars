Chapter 3 gave you the file-inspection toolkit. Each command answers a different
question:

| Command | Answers                                 |
| ------- | --------------------------------------- |
| `cat`   | "Show me the whole (short) file."       |
| `head`  | "Show me the _start_."                  |
| `tail`  | "Show me the _latest_ events."          |
| `less`  | "Let me _scroll_ through a long file."  |
| `wc`    | "How big is it — how many lines/words?" |

A common workflow when inspecting logs: `wc -l` to size the file, `head` to see how it
begins, `tail` to see the newest entries.

---

## Mission: Station Log Triage

The previous crew evacuated in a hurry and left three log files behind. Command needs a quick status report before we can re-occupy the station.

1. Use `cat` to read `summary.log` in full.
2. Use `head -n 3` to view the **first 3 lines** of `events.log`.
3. Use `tail -n 3` to view the **last 3 lines** of `events.log`.
4. Use `wc -l` to count the lines in `errors.log`.

**Expected result**

You see the full summary, the first and last three events, and the error count (3 lines).
