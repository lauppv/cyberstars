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

Before handing off to the night crew, you need to prepare a summary of `system.log`: how many warnings were logged, what non-routine events occurred, and a copy filed for the next shift.

1. Count how many lines contain `warning` — just the number, not the lines themselves.
2. Print every line that does **not** contain `info` — the non-routine events.
3. Print the `error` lines with a line number in front of each, so the night crew can jump straight to them.
4. Create a folder called `handoff` and copy `system.log` into it as `night-brief.log`.

**Expected result**

You see the warning count, the filtered non-routine lines, the numbered error line, and a copy of the log waiting in `handoff`.
