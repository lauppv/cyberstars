The **sed** command (stream editor) performs text transformations on the fly. Its most
common use is **find and replace**:

```bash
sed 's/old/new/' file.txt
```

The `s` stands for **substitute**. This replaces the **first** occurrence of `old` with
`new` on each line.

### Replace all occurrences on each line with `g`

```bash
sed 's/error/WARNING/g' log.txt
```

The trailing `g` (global) replaces every match on the line, not just the first.

### sed does not modify the original file

By default, `sed` prints the result to stdout. The file stays unchanged. To save, use
redirection:

```bash
sed 's/old/new/g' data.txt > data_fixed.txt
```

### Delimiters

The `/` is conventional but you can use any character:

```bash
sed 's|/usr/bin|/opt/bin|g' paths.txt
```

Using `|` avoids escaping all those slashes.

---

## Mission: Inspection Report Fix

The station just passed its safety re-inspection, but `report.txt` still shows old `FAIL` results from the previous round. The captain wants a clean report on file before the delegation arrives.

1. Use `sed` to replace **all** occurrences of `FAIL` with `PASS` in `report.txt` and display the corrected report.
2. Save the corrected report into a new file called `report-clean.txt`.
3. Create a folder called `records` and move `report-clean.txt` into it.
4. Count how many tests now show `PASS`.

**Expected result**

`records/report-clean.txt` shows `PASS` on every test line — no `FAIL` entries remain.
