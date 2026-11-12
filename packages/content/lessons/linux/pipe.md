The **pipe** (`|`) is one of Linux's most powerful ideas. It takes the output of one
command and feeds it directly as input to another command, no intermediate file needed.

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

Both work! But pipes shine when you chain commands that cannot take a filename as an
argument, or when you build longer chains (next lesson). The pipe makes every command
composable: each one does one small job, and you snap them together like modules on the
station.

### Another example

```bash
ls /usr/bin | wc -l
```

This counts how many programs are in `/usr/bin`: `ls` lists them, `wc -l` counts the
lines.

---

## Mission: Distress Signal Filter

The comms officer flagged `transmissions.log`: routine chatter mixed with distress calls, the lines starting with `mayday`. In a new `command-center` folder, command wants:

- `distress.txt` with every distress call;
- `count.txt` with how many there are, the number alone, made in one line straight from the log, without saving the calls anywhere first.

**Expected result**

`command-center/distress.txt` holds only the mayday lines, and `command-center/count.txt` holds just their number.
