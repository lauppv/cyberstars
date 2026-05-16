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

To delete a folder *and everything inside it*, use `rm` with the `-r` option
(**recursive**):

```bash
rm -r reports
```

This removes `reports`, every file in it, every sub-folder, and their contents — all
permanently.

### Handle with care

`rm -r` is powerful and dangerous. It deletes entire trees with no confirmation and no
undo. Always `ls` the folder first to be certain of what is inside.

| Command | Use it for |
|---------|------------|
| `rmdir` | an **empty** folder (safe) |
| `rm -r` | a folder **with content** (powerful, careful!) |

---

Clean up the station. In your home directory:

1. The folder `empty-bay` has nothing in it — remove it with `rmdir`.
2. The folder `old-data` is full of files — remove it (and its contents) with
   `rm -r`.

When you finish, both folders should be gone, but `mission` must remain.
