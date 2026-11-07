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

(The folder must exist first: `touch` does not create folders.)

### Why is it called "touch"?

If the file _already_ exists, `touch` does not erase it. It just updates the file's
"last modified" time. That is its original purpose. For a beginner, think of it
simply as **"create an empty file"**.

---

## Mission: Prepare Mission Files

The station commander needs empty files ready for today's briefing, and a place for the daily logs inside the `reports` folder you already have. When you are done, your home directory must look like this, every file empty:

```text
.
├── crew.txt
├── mission.txt
└── reports
    └── logs
        ├── day1.log
        └── day2.log
```

**Expected result**

Drawing your home directory as a tree shows exactly the plan above.
