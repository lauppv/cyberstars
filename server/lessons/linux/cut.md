The **cut** command extracts portions of each line — specific columns or character
positions. It is perfect for structured data like CSVs or colon-separated files.

### Cutting by delimiter and field with `-d` and `-f`

```bash
cut -d: -f1 crew_roster.txt
```

This splits each line on `:` and prints only field 1. Given a line like
`Voss:Commander:Deck1`, it outputs `Voss`.

You can select multiple fields:

```bash
cut -d: -f1,3 crew_roster.txt
```

Output: `Voss:Deck1` (fields 1 and 3).

### Cutting by character position with `-c`

```bash
cut -c1-4 codes.txt
```

This prints characters 1 through 4 of each line — useful for fixed-width data.

### In a pipeline

```bash
cat data.csv | cut -d, -f2
```

Extracts the second comma-separated column from a CSV stream.

---

The file `manifest.csv` uses commas as delimiters. Each line has the format:
`item,quantity,destination`. Use `cut` to extract **only the item names** (field 1)
and display them.
