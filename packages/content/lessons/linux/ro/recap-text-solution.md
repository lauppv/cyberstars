```bash
cut -d, -f1 date_brute.csv | sort | uniq -c > raport.txt
cat raport.txt
```

```text
      2 Chen
      2 Tanaka
      3 Voss
```
