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

The station commander needs three new files for today's briefing. Your home directory already has a `reports` folder ready.

1. Create an empty file called `mission.txt`.
2. Create an empty file called `crew.txt`.
3. Create an empty file called `summary.txt` **inside** the `reports` folder.

**Expected result**

Running `ls` in your home directory shows `mission.txt` and `crew.txt`, and running `ls reports` shows `summary.txt`.
