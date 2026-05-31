Sometimes you need a **copy** of a file — a backup, or a starting point for something
new. The **cp** command (**copy**) does exactly that.

The pattern is always: `cp SOURCE DESTINATION`.

```bash
cp mission.txt mission-backup.txt
```

This makes a second file, `mission-backup.txt`, with the same contents. The original
is left untouched.

### Copying into a folder

If the destination is an existing folder, the copy keeps its original name and lands
inside that folder:

```bash
cp mission.txt backups
```

This creates `backups/mission.txt`.

### Copying a whole folder: `cp -r`

A plain `cp` refuses to copy a directory:

```bash
cp reports reports-backup
```

```text
cp: -r not specified; omitting directory 'reports'
```

The `-r` option (**recursive**) copies the folder _and everything inside it_:

```bash
cp -r reports reports-backup
```

Now `reports-backup` is a full copy of `reports`.

### A word of caution

If the destination file already exists, `cp` **overwrites** it without asking. Pick
your destination names carefully.

---

## Mission: Emergency Backup

A solar storm warning has been issued. Critical station data must be backed up immediately before any damage occurs.

1. Make a backup copy of `mission.txt` called `mission-backup.txt`.
2. Copy the entire `reports` folder to a new folder called `reports-backup`.

**Expected result**

Your home directory now contains both `mission-backup.txt` and a `reports-backup` folder with the same contents as `reports`.
