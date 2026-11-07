```bash
cut -d, -f1 raw_data.csv | sort | uniq -c | sort -rn > report.txt
awk -F, '$2 == "scan" {sum += $3} END {print sum}' raw_data.csv > scan-total.txt
cat report.txt scan-total.txt
```

```text
      3 Voss
      2 Tanaka
      2 Chen
6
```
