```bash
df -h
du -sh cargo-bay/ > storage-report.txt
mkdir audit
mv storage-report.txt audit/
cat audit/storage-report.txt
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   32G   18G  64% /
tmpfs           2.0G     0  2.0G   0% /tmp
16K     cargo-bay/
```
