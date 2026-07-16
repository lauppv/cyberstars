`find -name` matches by name. But `find` can filter by other properties too — most
usefully by **type** and **size**.

### Filter by type: `-type`

The `-type` option says whether you want files or directories:

| Condition | Matches           |
| --------- | ----------------- |
| `-type f` | regular **files** |
| `-type d` | **directories**   |

```bash
find . -type d
```

That lists every folder under `.`. To find only files:

```bash
find . -type f -name "*.log"
```

This reads as: under `.`, find things that are **files** _and_ whose name ends in
`.log`. Multiple conditions are simply listed one after another — `find` requires
**all** of them to match.

### Filter by size: `-size`

The `-size` option matches files by how big they are:

| Example     | Matches                 |
| ----------- | ----------------------- |
| `-size +1k` | bigger than 1 kilobyte  |
| `-size -1k` | smaller than 1 kilobyte |
| `-size +1M` | bigger than 1 megabyte  |

A `+` means "more than", a `-` means "less than". The letter is the unit (`k`, `M`,
`G`).

```bash
find . -type f -size +1k
```

That finds every file larger than 1 KB.

---

## Mission: Station Directory Scan

The chief engineer needs a structural overview of the `station` folder before reorganising the file system, and the text notes gathered in one place.

1. List **only the directories** inside `station`.
2. List **only the `.txt` files** inside `station` (files, not folders).
3. Gather the text notes you found — create a folder called `txt-index` and copy `station/notes.txt` and `station/bay/manifest.txt` into it.

**Expected result**

You see the directory paths, then the `.txt` file paths, and the `txt-index` folder holds copies of both text notes.
