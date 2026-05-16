Chapter 6 armed you with a full text-processing toolkit:

| Command | Superpower |
|---------|-----------|
| `sort` | Reorder lines (alpha, numeric, by column) |
| `uniq` | Remove/count duplicates (after sorting) |
| `cut` | Extract columns by delimiter or position |
| `sed` | Find & replace in a stream |
| `awk` | Field processing, calculations, filtering |

These commands **compose** beautifully through pipes. A single pipeline can transform
raw data into a clean report.

---

The file `raw_data.csv` contains comma-separated records of crew activity:
`name,action,count`. Some entries are duplicated. Produce a clean report:

1. Use `cut` to extract only the **name** column (field 1, comma-delimited).
2. Pipe to `sort`.
3. Pipe to `uniq -c` to get counts.
4. Save the final result into `report.txt` using `>`.

Do it all in a single pipeline. When done, `report.txt` should show how many records
each crew member has.
