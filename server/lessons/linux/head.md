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
- Seeing how a log file *begins*
- Sampling a file without scrolling through all of it

Like `cat`, `head` only reads — it changes nothing.

---

A long log file `system.log` is in your home directory. Use **head** with the `-n`
option to print only its **first 5 lines**.
