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

The outgoing watch officer recorded the launch sequence in `mission.log`. Your shift is starting and you need to add two new status entries without erasing the existing record.

1. Append `status: shields nominal` to `mission.log` using `>>`.
2. Append `status: crew ready` to `mission.log` using `>>`.

When you finish, `cat mission.log` should show all three lines — the original entry plus your two updates.

**Expected result**

```text
status: launch sequence initiated
status: shields nominal
status: crew ready
```
