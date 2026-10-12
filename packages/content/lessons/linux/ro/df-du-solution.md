```bash
df -h
du -sh depozit/ > raport-stocare.txt
mkdir audit
mv raport-stocare.txt audit/
cat audit/raport-stocare.txt
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   32G   18G  64% /
tmpfs           2.0G     0  2.0G   0% /tmp
16K     depozit/
```
