Plain `ls` gives you a quick list, but it hides some things and leaves out useful
details. Commands often accept **options** — extra flags starting with a `-` that
change how they behave.

### Show hidden files: `ls -a`

Files whose names start with a dot (`.`) are **hidden**. Plain `ls` does not show
them. The `-a` option (**all**) reveals them:

```bash
ls -a
```

```text
.  ..  .secret.txt  crew.txt  mission.txt
```

You will also see `.` (the current directory) and `..` (the parent directory) — more
on those in the next lesson.

### Show details: `ls -l`

The `-l` option (**long** format) prints one item per line with extra information:

```bash
ls -l
```

```text
-rw-r--r-- 1 student student   24 May 16 10:00 crew.txt
drwxr-xr-x 2 student student 4096 May 16 10:00 reports
```

The very first character tells you the type:

- `-` means a **file**
- `d` means a **directory**

So now you can finally tell files and folders apart. (The other columns — permissions,
size, date — are covered in later chapters.)

### Combine options: `ls -la`

Options can be combined into one. `ls -la` means "long format **and** show all":

```bash
ls -la
```

You can write it as `ls -la`, `ls -al`, or `ls -l -a` — all the same.

---

## Mission: Uncover Hidden Files

Station security has flagged a hidden file somewhere in your home directory, and they also want a detailed look inside the `reports` folder. Regular scans missed the hidden file because hidden files do not show up in a plain listing.

1. List **all** items here (including hidden ones) in **long** format, in a single command.
2. Then inspect just the `reports` folder in long format.

**Expected result**

You see every item — including the hidden file starting with `.` — with details showing which entries are files and which are directories, plus a detailed listing of what lives inside `reports`.
