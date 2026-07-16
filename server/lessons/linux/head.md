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

## Mission: Check and Archive the Boot Sequence

The station's `system.log` records everything since the last reboot. Engineering wants to verify the boot sequence and keep a copy of the log for the diagnostics folder.

1. Print only the **first 5 lines** of `system.log` — the earliest boot events.
2. Create a folder called `diagnostics` and copy `system.log` into it as `boot.log`.
3. Verify the copy by printing just the **first 3 lines** of `diagnostics/boot.log`.

**Expected result**

The first boot events appear, then a shorter 3-line sample of the archived copy. The `diagnostics` folder holds a faithful copy of the log.
