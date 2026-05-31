The **pipe** (`|`) is one of Linux's most powerful ideas. It takes the output of one
command and feeds it directly as input to another command — no intermediate file needed.

The pattern is: `COMMAND1 | COMMAND2`.

```bash
cat system.log | grep error
```

```text
error: sensor 3 offline
error: low coolant
```

Here `cat` outputs the file, and `grep` receives that output and filters it. The pipe
connects them in real time.

### Why not just `grep error system.log`?

Both work! But pipes shine when you chain commands that **cannot** take a filename as an
argument, or when you build longer chains (next lesson). The pipe makes every command
composable — each one does one small job, and you snap them together like modules on the
station.

### Another example

```bash
ls /usr/bin | wc -l
```

This counts how many programs are in `/usr/bin` — `ls` lists them, `wc -l` counts the
lines.

---

## Mission: Distress Signal Filter

The station's comms officer has flagged `transmissions.log` — it contains routine chatter mixed with distress calls. Command needs only the emergencies.

Use a **pipe** to send the output of `cat transmissions.log` into `grep` and show only lines containing `mayday`.

**Expected result**

Three lines should appear, each starting with `mayday:`.
