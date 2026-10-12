```bash
ls raport.txt fantoma.txt 2> erori.log
cat erori.log
mkdir jurnale
mv erori.log jurnale/
grep "No such" jurnale/erori.log
```

```text
raport.txt
ls: cannot access 'fantoma.txt': No such file or directory
ls: cannot access 'fantoma.txt': No such file or directory
```
