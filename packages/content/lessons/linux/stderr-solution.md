```bash
mkdir logs
ls report.txt ghost.txt 2> logs/errors.log
cat logs/errors.log
```

```text
report.txt
ls: cannot access 'ghost.txt': No such file or directory
```
