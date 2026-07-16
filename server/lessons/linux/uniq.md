The **uniq** command removes **adjacent** duplicate lines. This is a key detail — it
only works on lines that are next to each other. That is why you almost always **sort
first**, then pipe to `uniq`.

```bash
sort access.log | uniq
```

This removes all duplicates and prints each unique line once.

### Counting duplicates with `-c`

```bash
sort access.log | uniq -c
```

```text
      3 deck 1
      1 deck 3
      2 deck 7
```

Each line is prefixed with how many times it appeared. This is an incredibly useful
pattern for quick data analysis.

### Why sort first?

Without sorting, `uniq` only collapses runs of identical lines:

```text
alpha
alpha    ← removed (adjacent duplicate)
beta
alpha    ← NOT removed (not adjacent)
```

The `sort | uniq` combo is so common it deserves its own muscle memory.

---

## Mission: Door Access Audit

Security flagged unusual activity on Deck 7. The file `door_access.log` records every crew member who swiped through the door. Find out who has been coming and going the most, and file the tally.

1. Combine `sort` and `uniq -c` through a pipe on `door_access.log` to count how many times each crew member accessed the door, and display it.
2. Save that tally into a new file called `access-tally.txt`.
3. Create a folder called `security` and move `access-tally.txt` into it.
4. Search the tally for `Voss` to confirm the crew member with the most entries.

**Expected result**

`security/access-tally.txt` holds each name once, prefixed by its access count; `Voss` has the most (3).
