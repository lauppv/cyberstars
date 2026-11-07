```bash
cut -d, -f1 date_brute.csv | sort | uniq -c | sort -rn > raport.txt
awk -F, '$2 == "scanare" {sum += $3} END {print sum}' date_brute.csv > total-scanari.txt
cat raport.txt total-scanari.txt
```

```text
      3 Voss
      2 Tanaka
      2 Chen
6
```
