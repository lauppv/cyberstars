Deleting **folders** needs a little more care than deleting files. You have two
tools.

### Empty folders: `rmdir`

The **rmdir** command (**remove directory**) deletes a folder — but **only if it is
empty**:

```bash
rmdir old-folder
```

If the folder still contains anything, `rmdir` refuses:

```bash
rmdir reports
```

```text
rmdir: failed to remove 'reports': Directory not empty
```

This refusal is a **safety feature** — it stops you wiping out files by accident.

### Folders with content: `rm -r`

To delete a folder _and everything inside it_, use `rm` with the `-r` option
(**recursive**):

```bash
rm -r reports
```

This removes `reports`, every file in it, every sub-folder, and their contents — all
permanently.

### Handle with care

`rm -r` is powerful and dangerous. It deletes entire trees with no confirmation and no
undo. Always `ls` the folder first to be certain of what is inside.

| Command | Use it for                                     |
| ------- | ---------------------------------------------- |
| `rmdir` | an **empty** folder (safe)                     |
| `rm -r` | a folder **with content** (powerful, careful!) |

---

## Mission: Decommission Old Bays

Two storage bays on the station are scheduled for decommissioning. The `empty-bay` folder has already been cleared out, but `old-data` still holds leftover files — and one of them, `a.log`, must be preserved before the bay is wiped.

1. Inspect the workspace, then look inside `old-data`, to see exactly what is there before you delete anything.
2. Create an `archive` folder and copy `old-data/a.log` into it as a safety backup.
3. Remove the empty `empty-bay` folder — the safe way that only works on empty folders.
4. Remove the `old-data` folder and everything inside it.

**Expected result**

Both bays are gone, `a.log` survives inside `archive`, and the `mission` folder is untouched.
