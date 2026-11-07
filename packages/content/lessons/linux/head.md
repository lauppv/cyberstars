Some files are huge: hundreds or thousands of lines. Dumping all of that with `cat`
floods your screen. Often you only want a quick peek at the **start** of a file.

The **head** command prints just the **first lines** of a file. By default, the
**first 10 lines**:

```bash
head bigfile.log
```

```text
line 1
line 2
...
line 10
```

### Choosing how many lines: `-n`

The `-n` option sets exactly how many lines you want:

```bash
head -n 3 bigfile.log
```

```text
line 1
line 2
line 3
```

### When head is useful

- Checking the **header row** of a data file
- Seeing how a log file _begins_
- Sampling a file without scrolling through all of it

Like `cat`, `head` only reads. It changes nothing.

---

## Mission: Check and Archive the Boot Sequence

`system.log` records everything since the last reboot, oldest first. Engineering wants the first five boot events and nothing after them, and a copy of the whole log kept as `diagnostics/boot.log`.

**Expected result**

You see exactly five lines, the earliest of the log, and the copy in `diagnostics` reads like the original.
