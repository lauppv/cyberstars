```bash
mkdir jurnale
ls raport.txt fantoma.txt 2> jurnale/erori.log
cat jurnale/erori.log
```

```text
raport.txt
ls: cannot access 'fantoma.txt': No such file or directory
```
