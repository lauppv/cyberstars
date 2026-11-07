```bash
mkdir security
sort door_access.log | uniq -c | sort -rn > security/access-tally.txt
cat security/access-tally.txt
```

```text
      4 Voss
      3 Tanaka
      2 Chen
```
