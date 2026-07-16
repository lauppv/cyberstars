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
over time — like a station log that grows with each shift.

---

## Mission: Shift Log Update

The outgoing watch officer recorded the launch sequence in `mission.log`. Your shift is starting and you need to update the record, then file a backup.

1. Add `status: shields nominal` to the end of `mission.log` without erasing the existing entry.
2. Add `status: crew ready` to the end of `mission.log` the same way.
3. Count the lines in `mission.log` to confirm it now holds three entries.
4. Create a folder called `archive` and copy `mission.log` into it under the name `mission-backup.log`.

**Expected result**

`mission.log` holds all three status lines, and `archive/mission-backup.log` is an identical backup:

```text
status: launch sequence initiated
status: shields nominal
status: crew ready
```
