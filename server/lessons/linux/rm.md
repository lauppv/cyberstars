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

The workspace has some leftover junk files. In your home directory:

1. Delete the file `junk.txt`.
2. Delete the file `temp.log`.

When you finish, both files should be gone, but `mission.txt` must still be there.
