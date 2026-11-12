`find -name` matches by name. But `find` can filter by other properties too, most
usefully by type and size.

### Filter by type: `-type`

The `-type` option says whether you want files or directories:

| Condition | Matches       |
| --------- | ------------- |
| `-type f` | regular files |
| `-type d` | directories   |

```bash
find . -type d
```

That lists every folder under `.`. To find only files:

```bash
find . -type f -name "*.log"
```

This reads as: under `.`, find things that are files _and_ whose name ends in
`.log`. Multiple conditions are simply listed one after another: `find` requires
all of them to match.

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

The chief engineer is reorganising the `station` folder and needs an overview first:

1. Every folder inside `station`, and nothing that is a file.
2. Every text note in `station`, the files ending in `.txt`, wherever they sit.
3. All those notes gathered in a new `txt-index` folder, each under its own name.

**Expected result**

You see the folder paths, then the paths of the text notes, and `txt-index` holds a copy of each note.
