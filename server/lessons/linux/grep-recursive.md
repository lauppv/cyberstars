So far `grep` searched **one file**. But what if you do not know *which* file contains
the word — only that it is somewhere in a folder full of files and sub-folders?

The `-r` option (**recursive**) tells `grep` to search **every file in a whole
directory tree**.

```bash
grep -r "sector 7" logs
```

```text
logs/january.log:Mission to sector 7 approved.
logs/old/archive.log:Sector 7 survey complete.
```

Notice the output now starts with the **file name** of each match, then a colon, then
the matching line. That way you know *where* every hit came from.

### Searching from the current folder

A single dot `.` means "the current directory". To search everything under where you
stand:

```bash
grep -r "error" .
```

### Combine with other options

Recursive search works with the options you already know:

```bash
grep -ri "error" logs     # recursive + case-insensitive
grep -rn "error" logs     # recursive + line numbers
```

`grep -r` is how you answer "is this word mentioned *anywhere* in my project?".

---

The `logs` folder contains several files in sub-folders. Use **grep -r** to find every
line mentioning `failure` anywhere inside the `logs` directory.
