```bash
ls report.txt ghost.txt 2> errors.log
cat errors.log
```

```text
report.txt
ls: cannot access 'ghost.txt': No such file or directory
```
