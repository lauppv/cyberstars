The **mv** command (**move**) does two jobs with one tool: it **moves** files to a
different folder, and it **renames** them. Same pattern as `cp`: `mv SOURCE
DESTINATION`.

### Renaming a file

If the destination is just a new name, the file is renamed in place:

```bash
mv draft.txt final.txt
```

`draft.txt` is gone; `final.txt` now holds its contents. Unlike `cp`, no extra copy is
left behind — `mv` _moves_, it does not duplicate.

### Moving a file into a folder

If the destination is an existing folder, the file is moved inside it, keeping its
name:

```bash
mv final.txt reports
```

Now the file lives at `reports/final.txt`.

### Move and rename at once

You can do both in one command — move into a folder _and_ give a new name:

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

## Mission: File Relocation

The station's filing system is being reorganised. A draft needs finalising, loose notes need archiving, and the archive folder itself is getting a new name. Your home directory contains `draft.txt`, `notes.txt` and an `archive` folder.

1. Rename `draft.txt` to `report.txt`.
2. Move `report.txt` into the `archive` folder.
3. Move `notes.txt` into `archive` and rename it to `notes-2026.txt` in a **single** command.
4. Rename the `archive` folder itself to `records`.

**Expected result**

The `records` folder holds `report.txt` and `notes-2026.txt`; the old `draft.txt`, `notes.txt` and `archive` names are gone.
