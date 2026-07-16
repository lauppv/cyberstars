When a file is no longer needed, the **rm** command (**remove**) deletes it.

```bash
rm old-notes.txt
```

The file is gone immediately. Run `ls` to confirm it disappeared.

### A serious warning

There is **no recycle bin** in the terminal. `rm` does not move files to trash — it
**destroys them permanently**. There is no "undo".

So before you press Enter, always read your command twice. A good habit is to `ls`
first and make sure you are deleting exactly what you mean to.

### Deleting several files

`rm` accepts multiple names:

```bash
rm log1.txt log2.txt log3.txt
```

### Asking before each delete: `rm -i`

The `-i` option (**interactive**) makes `rm` ask for confirmation before removing each
file:

```bash
rm -i important.txt
```

```text
rm: remove regular file 'important.txt'?
```

You type `y` to confirm or `n` to cancel. For beginners, `rm -i` is a safe habit when
deleting anything you are unsure about.

---

## Mission: Purge Junk Data

A routine maintenance scan flagged leftover junk cluttering the station workspace. Before you delete anything, secure the one file that matters — there is no undo for `rm`.

1. Create a `keep` folder and copy `mission.txt` into it as a safety backup.
2. Review the workspace before deleting anything.
3. Delete the three junk files `junk.txt`, `temp.log` and `cache.tmp` in a **single** command.

**Expected result**

The junk files are gone, `mission.txt` is still in your home directory, and a safety copy sits in `keep`.
