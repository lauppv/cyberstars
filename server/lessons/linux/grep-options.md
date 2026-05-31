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
_and_ numbered.

---

## Mission: Shift-End Log Summary

Before handing off to the night crew, you need to prepare a summary of `system.log`: how many warnings were logged, and what non-routine events occurred.

1. Use `grep -c warning system.log` to count how many lines contain `warning`.
2. Use `grep -v info system.log` to print every line that does **not** contain `info`.

**Expected result**

First you see the warning count (a single number), then the filtered lines showing only warnings and errors.
