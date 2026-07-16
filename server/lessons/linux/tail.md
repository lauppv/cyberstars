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

`tail`, like `head`, only reads — it never changes the file.

---

## Mission: Sample and Archive the Alert

Something triggered an alert on the station. Before filing the incident report, you want to sample the log from both ends and keep a copy.

1. Look at just the **first 3 lines** of `system.log` to see how it began after boot.
2. Read the **last 4 lines** of `system.log` — the most recent events that triggered the alert.
3. Create a folder called `alerts` and copy `system.log` into it as `incident.log` for the report.

**Expected result**

You see the first few boot lines, then the latest 4 alert lines. The `alerts` folder holds a copy of the log for the incident record.
