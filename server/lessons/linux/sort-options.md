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

## Mission: Power Grid Diagnostics

Engineering detected fluctuations in the station's power grid. The file `power_readings.txt` lists each sector and its current power level. To act on the weakest sector first, you need the readings ordered and filed.

1. Sort `power_readings.txt` **numerically by the second column** so the lowest power reading appears at the top, and display it.
2. Save that sorted diagnostic into a new file called `diagnostics.txt`.
3. Create a folder called `engineering` and move `diagnostics.txt` into it.
4. Show just the top line — the weakest sector, which the repair crew handles first.

**Expected result**

`engineering/diagnostics.txt` lists the sectors in ascending power order, from `epsilon 5` to `delta 800`.
