A single pipe is useful. A **pipeline** of three or more commands is where Linux really
shines. Each command does one job and passes its result to the next.

```bash
cat access.log | grep "denied" | wc -l
```

```text
3
```

This pipeline: (1) reads the file, (2) keeps only "denied" lines, (3) counts them.

### Sorting inside a pipeline

```bash
cat names.txt | sort | head -3
```

This outputs the first 3 names in alphabetical order — `sort` reorders, `head` trims.

### Building step by step

The best way to build a pipeline is **incrementally**:

1. Start with the data source: `cat file`
2. Add one command, check the output.
3. Add the next command, check again.

If something goes wrong, remove the last pipe and inspect the intermediate output.

### Common pipeline commands

| Command         | Role in a pipeline      |
| --------------- | ----------------------- |
| `grep`          | Filter lines            |
| `sort`          | Reorder lines           |
| `wc -l`         | Count lines             |
| `head` / `tail` | Take first/last N lines |

---

The file `events.log` records station events. Build a pipeline that: takes the file
content, filters lines containing `alert`, sorts them alphabetically, and shows only
the **first 2** results. Chain at least 3 pipes.
