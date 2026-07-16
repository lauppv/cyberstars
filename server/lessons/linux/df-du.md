Every station has limited storage. Two commands help you monitor disk space:

**`df`** (disk free) shows how much space is available on each mounted filesystem.
Add `-h` for human-readable sizes:

```bash
df -h
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   32G   18G  64% /
tmpfs           2.0G     0  2.0G   0% /tmp
```

**`du`** (disk usage) shows how much space a directory or file occupies:

```bash
du -h logs/
```

```text
4.0K    logs/access.log
12K     logs/error.log
16K     logs/
```

### Summarize a directory

When you only want the **total** size without listing every file, use `-s`
(summary):

```bash
du -sh logs/
```

```text
16K     logs/
```

Together: `df -h` answers "how full is the disk?" and `du -sh FOLDER` answers "how
big is this folder?"

---

## Mission: Storage Audit

The station engineers suspect `cargo-bay/` is eating into the limited disk reserves. Before they approve the next data archive, they want a filed report of both the overall disk situation and the folder's footprint.

1. Display how much space is free on the station's filesystems.
2. Measure the total size of the `cargo-bay/` directory and save that measurement into a file called `storage-report.txt`.
3. Create a folder called `audit` and move `storage-report.txt` into it.
4. Display the saved report to confirm it.

**Expected result**

`audit/storage-report.txt` holds the human-readable size of `cargo-bay/`.
