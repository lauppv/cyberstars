When a file is no longer needed, the **rm** command (**remove**) deletes it.

```bash
rm old-notes.txt
```

The file is gone immediately. Run `ls` to confirm it disappeared.

### A serious warning

There is **no recycle bin** in the terminal. `rm` does not move files to trash. It
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

A maintenance scan flagged junk cluttering your home directory. Only the mission file matters, and there is no undo for deleting, so first put a copy of it in a new `keep` folder. Then clear out every other file in your home directory.

**Expected result**

Your home directory holds the mission file and `keep` with its copy, and nothing else.
