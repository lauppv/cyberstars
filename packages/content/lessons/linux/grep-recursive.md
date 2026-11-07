So far `grep` searched **one file**. But what if you do not know _which_ file contains
the word, only that it is somewhere in a folder full of files and sub-folders?

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

A recurring malfunction has been reported. The `logs` folder holds logs spread over several sub-folders, and the maintenance team needs every mention of `failure` in any of them, with the file each one came from. One of those failures is in the coolant pump: pull the log that reports it out as evidence, copied to `investigation/evidence.log`.

**Expected result**

You see every `failure` line with its file, and `investigation/evidence.log` is a copy of the log that reports the coolant pump failure.
