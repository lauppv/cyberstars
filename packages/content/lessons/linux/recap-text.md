Chapter 6 armed you with a full text-processing toolkit:

| Command | Superpower                                |
| ------- | ----------------------------------------- |
| `sort`  | Reorder lines (alpha, numeric, by column) |
| `uniq`  | Remove/count duplicates (after sorting)   |
| `cut`   | Extract columns by delimiter or position  |
| `sed`   | Find & replace in a stream                |
| `awk`   | Field processing, calculations, filtering |

These commands **compose** beautifully through pipes. A single pipeline can transform
raw data into a clean report.

---

## Mission: Crew Activity Report

The station administrator needs a summary of crew activity from `raw_data.csv`, which records one task per line: who did it, what kind of task, and how many times. It is unsorted and the names repeat. Make two files, each straight from the data:

- `report.txt`: each crew member once, with how many records they have, the most active first;
- `scan-total.txt`: the number alone, how many scans the crew made in all, adding up the last column of every `scan` record.

**Expected result**

`report.txt` has one line per crew member with their number of records, the most active on top, and `scan-total.txt` holds one number.
