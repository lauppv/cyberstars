So far `grep` searched **one file**. But what if you do not know _which_ file contains
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
the matching line. That way you know _where_ every hit came from.

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

`grep -r` is how you answer "is this word mentioned _anywhere_ in my project?".

---

## Mission: Failure Investigation

A recurring malfunction has been reported and the maintenance team needs every mention of `failure` from the station logs, plus the offending file pulled out for evidence. The `logs` folder contains files spread across several sub-folders.

1. Search recursively for `failure` everywhere under the `logs` folder — each hit shows which file it came from.
2. Create a folder called `investigation` and copy the January log `logs/january.log`, which holds the coolant-pump failure, into it as `evidence.log`.
3. Display the evidence file to confirm it captured the failure line.

**Expected result**

Every `failure` line appears with its file path, and the `investigation` folder holds a copy of the January log as `evidence.log`.
