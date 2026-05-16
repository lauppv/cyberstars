The **mv** command (**move**) does two jobs with one tool: it **moves** files to a
different folder, and it **renames** them. Same pattern as `cp`: `mv SOURCE
DESTINATION`.

### Renaming a file

If the destination is just a new name, the file is renamed in place:

```bash
mv draft.txt final.txt
```

`draft.txt` is gone; `final.txt` now holds its contents. Unlike `cp`, no extra copy is
left behind — `mv` *moves*, it does not duplicate.

### Moving a file into a folder

If the destination is an existing folder, the file is moved inside it, keeping its
name:

```bash
mv final.txt reports
```

Now the file lives at `reports/final.txt`.

### Move and rename at once

You can do both in one command — move into a folder *and* give a new name:

```bash
mv notes.txt archive/notes-2026.txt
```

### Moving folders

`mv` handles directories with no special option (unlike `cp`, which needs `-r`):

```bash
mv oldname newname
```

Like `cp`, `mv` overwrites an existing destination file without warning, so choose
names carefully.

---

Tidy up the workspace. In your home directory:

1. Rename `draft.txt` to `report.txt`.
2. Move `report.txt` into the `archive` folder.

When you finish, the file should be at `archive/report.txt` and no longer in your home
directory.
