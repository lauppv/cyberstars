Folders need **files** inside them. The quickest way to create a new, empty file is
the **touch** command.

```bash
touch notes.txt
```

Again, success is silent. Confirm with `ls`:

```bash
ls
```

```text
notes.txt
```

The file exists but is completely empty (0 bytes) until you put something in it.

### Several files at once

Like `mkdir`, `touch` accepts multiple names:

```bash
touch log1.txt log2.txt log3.txt
```

### Creating a file inside a folder

If the folder already exists, you can `touch` a file straight into it:

```bash
touch reports/summary.txt
```

(The folder must exist first — `touch` does not create folders.)

### Why is it called "touch"?

If the file _already_ exists, `touch` does not erase it — it just updates the file's
"last modified" time. That is its original purpose. For a beginner, think of it
simply as **"create an empty file"**.

---

## Mission: Prepare Mission Files

The station commander needs new files for today's briefing, plus a fresh place to keep the daily logs. Your home directory already has a `reports` folder ready.

1. Create two empty files `mission.txt` and `crew.txt` in your home directory with a **single** command.
2. Make a new folder `logs` inside `reports`.
3. Create two empty log files inside it: `reports/logs/day1.log` and `reports/logs/day2.log`.
4. Verify the log folder as a tree.

**Expected result**

The listing shows `mission.txt` and `crew.txt`, and the tree of `reports` shows `day1.log` and `day2.log` inside `reports/logs`.
