```bash
ls -l
ls -l > audit.txt
mkdir audit-report
mv audit.txt audit-report/
wc -l audit-report/audit.txt
```

```text
-rwxr-xr-x 1 student student   42 Jan 10 08:00 diagnostics.sh
-rw-r--r-- 1 student student   20 Jan 10 08:00 manifest.dat
-rw-r--r-- 1 student student   33 Jan 10 08:00 notes.txt
4 audit-report/audit.txt
```
