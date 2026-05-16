`find -name` matches by name. But `find` can filter by other properties too — most
usefully by **type** and **size**.

### Filter by type: `-type`

The `-type` option says whether you want files or directories:

| Condition | Matches |
|-----------|---------|
| `-type f` | regular **files** |
| `-type d` | **directories** |

```bash
find . -type d
```

That lists every folder under `.`. To find only files:

```bash
find . -type f -name "*.log"
```

This reads as: under `.`, find things that are **files** *and* whose name ends in
`.log`. Multiple conditions are simply listed one after another — `find` requires
**all** of them to match.

### Filter by size: `-size`

The `-size` option matches files by how big they are:

| Example | Matches |
|---------|---------|
| `-size +1k` | bigger than 1 kilobyte |
| `-size -1k` | smaller than 1 kilobyte |
| `-size +1M` | bigger than 1 megabyte |

A `+` means "more than", a `-` means "less than". The letter is the unit (`k`, `M`,
`G`).

```bash
find . -type f -size +1k
```

That finds every file larger than 1 KB.

---

Explore the `station` folder under your home directory:

1. Use `find` with `-type d` to list **only the directories** inside `station`.
2. Use `find` with `-type f` and `-name "*.txt"` to list **only the .txt files**
   inside `station`.
