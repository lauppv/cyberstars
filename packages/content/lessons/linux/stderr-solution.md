```bash
ls report.txt ghost.txt 2> errors.log
cat errors.log
mkdir logs
mv errors.log logs/
grep "No such" logs/errors.log
```

```text
report.txt
ls: cannot access 'ghost.txt': No such file or directory
ls: cannot access 'ghost.txt': No such file or directory
```
