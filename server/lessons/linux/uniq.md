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

Security flagged unusual activity on Deck 7. The file `door_access.log` records every crew member who swiped through the door. Find out who has been coming and going the most.

Pipe `sort` and `uniq -c` together on `door_access.log` to count how many times each crew member accessed the door.

**Expected result**

Each crew member's name appears once, prefixed by their access count. You should see that Voss had the most entries (3).
