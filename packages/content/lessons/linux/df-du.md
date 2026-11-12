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

When you only want the total size without listing every file, use `-s`
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

The engineers suspect `cargo-bay` is eating into the station's disk reserves. Before they approve the next archive, look at how much space the station's filesystems have left, then file one line in `audit/storage-report.txt`: the total size of `cargo-bay`, everything inside it counted, in units a person reads at a glance.

**Expected result**

`audit/storage-report.txt` holds a single line: a size like `12K` followed by `cargo-bay`.
