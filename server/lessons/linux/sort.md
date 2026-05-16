The **sort** command rearranges lines of text into order. By default it sorts
alphabetically (A before B, lowercase after uppercase).

```bash
sort crew.txt
```

```text
Chen
Okafor
Tanaka
Voss
```

The original file is unchanged — `sort` prints the sorted result to stdout. You can
save it with `> sorted.txt` if needed.

### Reverse order with `-r`

```bash
sort -r crew.txt
```

```text
Voss
Tanaka
Okafor
Chen
```

### Sorting is case-sensitive by default

Uppercase letters sort before lowercase. If you want true alphabetical order regardless
of case, add `-f` (fold case):

```bash
sort -f mixed.txt
```

### Sort in a pipeline

`sort` is a perfect pipeline citizen — it reads stdin if no file is given:

```bash
grep "error" log.txt | sort
```

This filters errors first, then sorts them alphabetically.

---

The file `supplies.txt` lists cargo items in random order. Sort them **in reverse
alphabetical order** and display the result on screen.
