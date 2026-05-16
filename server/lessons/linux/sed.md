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

The file `report.txt` contains several lines where the word `FAIL` appears. Use `sed`
to replace **all** occurrences of `FAIL` with `PASS` and display the result on screen.
