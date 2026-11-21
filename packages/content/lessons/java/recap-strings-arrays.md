Put StringBuilder, format, split, arrays and their helpers to work together in one program

---

## Mission: Parking Garage

Tommy owns a parking garage now, and the night guard sends him a report of which spots are taken. The report is one line: the levels are separated by `/`, and on each level every char is one spot, `X` when it is taken and `.` when it is free. Store the report in a `String` named `report`, for example `XX.X/..X./XXXX`.

Print:

1. One line per level: `Level N | <the level's spots> | F free`, with levels counted from 1
2. `Free spots: ` followed by every free spot as `level-spot`, separated by a comma and a space, with both counted from 1. If no spot is free, print `Free spots: none`
3. `Total free: N`

Build the list of free spots with a StringBuilder.

**Example** for `report = "XX.X/..X./XXXX"`

```text
Level 1 | XX.X | 1 free
Level 2 | ..X. | 3 free
Level 3 | XXXX | 0 free
Free spots: 1-3, 2-1, 2-2, 2-4
Total free: 4
```

**Example** for `report = "XX/X"`

```text
Level 1 | XX | 0 free
Level 2 | X | 0 free
Free spots: none
Total free: 0
```

**Example** for `report = "."`

```text
Level 1 | . | 1 free
Free spots: 1-1
Total free: 1
```
