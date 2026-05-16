Plain `grep` is useful, but a few options make it far smarter.

### Ignore case: `grep -i`

By default `grep` is case-sensitive — `Error` and `error` are different. The `-i`
option makes the search **case-insensitive**:

```bash
grep -i error system.log
```

This matches `error`, `Error`, `ERROR`, and any mix.

### Count matches: `grep -c`

The `-c` option prints just the **number** of matching lines, not the lines
themselves:

```bash
grep -c warning system.log
```

```text
3
```

### Invert the match: `grep -v`

The `-v` option flips the search — it prints lines that **do NOT** contain the word:

```bash
grep -v info system.log
```

This hides every `info` line and shows everything else.

### Show line numbers: `grep -n`

The `-n` option puts the **line number** in front of each match:

```bash
grep -n error system.log
```

```text
5:error: sensor 3 offline
```

Options combine, just like with `ls`: `grep -in error system.log` is case-insensitive
*and* numbered.

---

The file `system.log` is in your home directory. Use **grep** options to:

1. Count how many lines contain `warning` — use `grep -c`.
2. Print every line that does **NOT** contain `info` — use `grep -v`.
