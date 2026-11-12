Sometimes you need a copy of a file: a backup, or a starting point for something
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

A solar storm warning has been issued. Before it hits, everything that matters must exist twice: put a copy of the mission file and of the whole `reports` folder, every log inside it included, into a new folder called `backups`. The originals stay where they are.

**Expected result**

`backups` holds the mission file and a `reports` folder with the same logs as the original, which is still in your home directory.
