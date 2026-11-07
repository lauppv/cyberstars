You learned that `>` overwrites a file. When you want to **add** new lines at the end
without destroying existing content, use `>>` (double arrow).

The pattern is: `COMMAND >> FILE`.

```bash
echo "Entry 1: docking complete" >> ship.log
echo "Entry 2: cargo loaded" >> ship.log
cat ship.log
```

```text
Entry 1: docking complete
Entry 2: cargo loaded
```

Both lines are preserved. Each `>>` appends to the bottom.

### `>` vs `>>`

| Operator | Behavior           |
| -------- | ------------------ |
| `>`      | Create / overwrite |
| `>>`     | Create / append    |

If the file does not exist yet, **both** `>` and `>>` will create it. The difference
only matters when the file already has content.

A common pattern is to use `>` once to start fresh, then `>>` to accumulate more data
over time, like a station log that grows with each shift.

---

## Mission: Shift Log Update

The outgoing watch officer started `mission.log` with the launch sequence. Your shift adds two entries after it, `status: shields nominal` and then `status: crew ready`, and the first entry must survive. Then file a backup as `archive/mission-backup.log`.

**Expected result**

`mission.log` holds the three status lines in order, and the backup is identical to it.
