Sometimes you do not want to _read_ a file — you want to **measure** it. How many
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

| Option  | Counts              |
| ------- | ------------------- |
| `wc -l` | **lines** only      |
| `wc -w` | **words** only      |
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

## Mission: Count and File the Inventory

`inventory.txt` lists every item in the cargo bay, one per line. The quartermaster needs an exact count before the next resupply shuttle arrives, plus a filed copy of the manifest.

1. Count **how many lines** are in `inventory.txt` — that is the number of items.
2. Run a full measure of `inventory.txt` to see its lines, words and characters together.
3. Create a folder called `manifest` and copy `inventory.txt` into it as `inventory-checked.txt`.
4. Confirm the filed copy has the same item count by counting **its** lines too.

**Expected result**

You see the item count and the full measurement, and the `manifest` folder holds a copy whose line count matches the original.
