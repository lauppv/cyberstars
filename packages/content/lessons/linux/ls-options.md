Plain `ls` gives you a quick list, but it hides some things and leaves out useful
details. Commands often accept **options**: extra flags starting with a `-` that
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

You will also see `.` (the current directory) and `..` (the parent directory). More
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

- `-` means a file
- `d` means a directory

So now you can finally tell files and folders apart. (The other columns, permissions,
size, date, are covered in later chapters.)

### Combine options: `ls -la`

Options can be combined into one. `ls -la` means "long format and show all":

```bash
ls -la
```

You can write it as `ls -la`, `ls -al`, or `ls -l -a`: all the same.

---

## Mission: Uncover Hidden Files

Station security says a file is hiding in your home directory, where a plain listing doesn't show it. They want a single command that lists your home directory with every item, the hidden ones too, and tells the files from the folders. Then they want the same details for what is inside `reports`, without you going in.

**Expected result**

You can name the hidden file, say which entries are folders, and give the size of the file kept in `reports`.
