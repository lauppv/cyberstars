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

The station administrator needs a summary of crew activity from `raw_data.csv`. The file contains comma-separated records (`name,action,count`), but some entries are duplicated and it is not sorted. Turn this raw data into a clean report — in a single pipeline.

Extract only the name column (field 1, comma-delimited) from `raw_data.csv`, sort those names, count how many times each one occurs, and save the result into `report.txt`.

**Expected result**

Running `cat report.txt` shows each crew member's name with a count: Chen appears 2 times, Tanaka 2 times, and Voss 3 times.
