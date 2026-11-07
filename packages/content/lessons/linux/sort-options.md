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

Engineering detected fluctuations in the power grid. `power_readings.txt` lists each sector with its power level. To act on the weakest sector first, they want, in a new `engineering` folder, every reading ordered from the lowest power to the highest as `diagnostics.txt`, and the weakest sector's line alone as `weakest.txt`.

**Expected result**

`engineering/diagnostics.txt` lists the sectors by rising power level, and `engineering/weakest.txt` holds only the weakest one.
