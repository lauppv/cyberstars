The opposite of `head` is **tail**. It prints the **last lines** of a file.

By default, `tail` shows the **last 10 lines**:

```bash
tail bigfile.log
```

### Choosing how many lines: `-n`

Just like `head`, the `-n` option sets the count:

```bash
tail -n 3 bigfile.log
```

```text
line 98
line 99
line 100
```

### Why the end of a file matters

Log files grow by adding **new lines at the bottom**. So the _most recent_ events are
always at the **end**. When something just went wrong, the answer is almost always in
the last few lines:

```bash
tail -n 5 error.log
```

`head` shows you how a file _began_; `tail` shows you the _latest_ news. Together they
let you sample a big file from both ends without reading the middle.

`tail`, like `head`, only reads. It never changes the file.

---

## Mission: Sample and Archive the Alert

Something triggered an alert. Before filing the incident report, sample `system.log` from both ends: the three lines it began with after boot, and the four most recent lines, which led to the alert. Then keep a copy of the log as `alerts/incident.log`.

**Expected result**

You see the three first lines, then the four last ones, and the copy in `alerts` reads like the original.
