A log file can have thousands of lines. You rarely want all of them — you want the
lines that mention a particular word. The **grep** command finds them for you.

`grep` searches a file and prints **only the lines that contain** your search text.

The pattern is: `grep WORD FILE`.

```bash
grep error system.log
```

```text
error: sensor 3 offline
error: low coolant
```

Every line that contains `error` is printed; every other line is hidden.

### Searching for a phrase

If your search text contains spaces, wrap it in quotes:

```bash
grep "low coolant" system.log
```

### When nothing matches

If no line matches, `grep` simply prints nothing and returns you to the prompt. That
is not an error — it means "not found".

`grep` is one of the most powerful everyday tools on Linux. "Where is this word
mentioned?" — `grep` answers it instantly.

---

The file `system.log` records the station's events. Use **grep** to print only the
lines that contain the word `warning`.
