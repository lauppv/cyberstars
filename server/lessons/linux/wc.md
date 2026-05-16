Sometimes you do not want to *read* a file — you want to **measure** it. How many
lines? How many words? The **wc** command (**word count**) tells you.

Run plain `wc` on a file:

```bash
wc crew.txt
```

```text
 3  3 15 crew.txt
```

The three numbers are, in order:

1. **lines**
2. **words**
3. **characters (bytes)**

### Counting just one thing

Options narrow it down to a single number:

| Option | Counts |
|--------|--------|
| `wc -l` | **lines** only |
| `wc -w` | **words** only |
| `wc -c` | **characters** only |

```bash
wc -l crew.txt
```

```text
3 crew.txt
```

### Why this is useful

`wc -l` is one of the most-used commands on Linux. "How many entries are in this
list?" "How many errors are in this log?" — count the lines and you have your answer.
Later you will feed other commands' output straight into `wc` to count results
automatically.

---

In your home directory there is a file `inventory.txt`, one item per line. Use **wc**
with the right option to count **how many lines** (items) it has.
