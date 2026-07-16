Beyond printing fields, awk can **calculate**. You can use variables, patterns, and
special blocks like `END` to produce summaries.

### Summing a column

```bash
awk '{sum += $2} END {print sum}' readings.txt
```

This adds up every value in column 2 and prints the total after all lines are
processed. The `END` block runs once, after the last line.

### Counting lines that match a pattern

```bash
awk '/error/ {count++} END {print count}' log.txt
```

The `/error/` is a pattern — only lines containing "error" trigger the action. At the
end, we print how many matched.

### Combining pattern and calculation

```bash
awk '$3 > 100 {print $1, $3}' data.txt
```

This prints field 1 and 3 only for lines where field 3 is greater than 100. Awk
patterns can be regex (`/word/`) or conditions (`$2 == "alpha"`).

---

## Mission: Cargo Weight Report

The station is approaching a gravity-assist manoeuvre and the pilot needs a full cargo mass report. The file `cargo_weight.txt` lists each item and its weight in column 2.

1. Add up every weight in column 2 and print the combined total.
2. Save that total into a new file called `total-weight.txt`.
3. List only the heavy items — those with a weight above 100 — showing the name and the weight.
4. Create a folder called `flight-deck` and move `total-weight.txt` into it.

**Expected result**

`flight-deck/total-weight.txt` holds the combined weight of all cargo items (`610`).
