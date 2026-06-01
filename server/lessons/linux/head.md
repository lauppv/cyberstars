Some files are huge — hundreds or thousands of lines. Dumping all of that with `cat`
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

Like `cat`, `head` only reads — it changes nothing.

---

## Mission: Check the Boot Sequence

The station's `system.log` file records everything since the last reboot. Engineering wants to verify the boot sequence by looking at just the very beginning of the log.

Use `head` with the `-n` option to print only the **first 5 lines** of `system.log`.

**Expected result**

Only the first 5 lines of the log appear — the earliest events recorded after boot.
