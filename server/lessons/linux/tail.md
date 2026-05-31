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

## Mission: Check the Latest Alerts

Something triggered an alert on the station. The most recent events are always at the end of `system.log`. You need to check what just happened.

Use `tail` with the `-n` option to print only the **last 4 lines** of `system.log`.

**Expected result**

The 4 most recent log entries appear, showing you the latest station events.
