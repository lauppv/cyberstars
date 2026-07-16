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

The station's comms officer has flagged `transmissions.log` — it contains routine chatter mixed with distress calls. Command needs the emergencies isolated and filed.

1. Use a **pipe** to send the output of `cat transmissions.log` into `grep` and keep only the lines containing `mayday`.
2. Send that filtered stream into a new file called `distress.txt` instead of the screen.
3. Create a folder called `command-center` and move `distress.txt` into it.
4. Count how many distress calls the file holds.

**Expected result**

`command-center/distress.txt` holds the three `mayday:` lines.
