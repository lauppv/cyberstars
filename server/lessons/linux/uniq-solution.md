```bash
sort door_access.log | uniq -c
sort door_access.log | uniq -c > access-tally.txt
mkdir security
mv access-tally.txt security/
grep Voss security/access-tally.txt
```

```text
      2 Chen
      3 Tanaka
      3 Voss
      3 Voss
```
