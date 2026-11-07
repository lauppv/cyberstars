The **cut** command extracts portions of each line: specific columns or character
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

This prints characters 1 through 4 of each line, useful for fixed-width data.

### In a pipeline

```bash
cat data.csv | cut -d, -f2
```

Extracts the second comma-separated column from a CSV stream.

---

## Mission: Cargo Manifest Quick-List

The supply shuttle docks in minutes. Look at how `manifest.csv` is laid out, then make two lists for the deck officer in a new `deck-office` folder:

- `item-list.txt` with only the item names, one per line;
- `destinations.txt` with each item and where it goes, as the manifest writes them, but without the quantities.

**Expected result**

`deck-office/item-list.txt` holds the item names alone, and `deck-office/destinations.txt` the items with their destinations, nothing in between.
