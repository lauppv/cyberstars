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

Two storage bays on the station are scheduled for decommissioning. The `empty-bay` folder has already been cleared out, but `old-data` still contains leftover files.

1. Remove the empty `empty-bay` folder using `rmdir`.
2. Remove the `old-data` folder and all its contents using `rm -r`.

**Expected result**

Both folders are gone, but the `mission` folder remains untouched.
