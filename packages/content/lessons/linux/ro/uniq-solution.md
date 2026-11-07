```bash
mkdir securitate
sort acces_usa.log | uniq -c | sort -rn > securitate/bilant-acces.txt
cat securitate/bilant-acces.txt
```

```text
      4 Voss
      3 Tanaka
      2 Chen
```
