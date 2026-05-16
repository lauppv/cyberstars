Plain `sort` treats everything as text. The number `9` sorts **after** `80` because `9`
comes after `8` alphabetically. To sort by actual numeric value, use `-n`:

```bash
sort -n scores.txt
```

```text
5
12
80
103
```

Without `-n` the order would be `103, 12, 5, 80` (text sorting).

### Sorting by a specific column with `-k`

Many data files have columns separated by spaces. Use `-k` to sort by a particular
column number:

```bash
sort -k2 roster.txt
```

This sorts by the **second** column. Combine with `-n` to sort numerically by that
column:

```bash
sort -k2 -n roster.txt
```

### Specifying a delimiter with `-t`

If columns are separated by something other than whitespace (like a colon), tell sort:

```bash
sort -t: -k3 -n data.txt
```

This uses `:` as the delimiter and sorts by column 3 numerically.

---

The file `power_readings.txt` has two columns: a sector name and a numeric power level.
Sort the file **numerically by the second column** (the power level) so the lowest
reading appears first.
