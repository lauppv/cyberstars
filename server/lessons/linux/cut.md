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

## Mission: Cargo Manifest Quick-List

The supply shuttle is docking in minutes and the deck officer needs a plain list of item names from `manifest.csv` — no quantities, no destinations, just the items.

1. Use `cut` to extract **only the item names** (field 1) from the comma-delimited `manifest.csv`, and display them.
2. Save that item list into a new file called `item-list.txt`.
3. Create a folder called `deck-office` and move `item-list.txt` into it.
4. Count how many items ended up on the list.

**Expected result**

`deck-office/item-list.txt` holds the five item names, one per line, with no other columns.
