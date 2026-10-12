```bash
cut -d, -f1 raw_data.csv | sort | uniq -c > report.txt
cat report.txt
```

```text
      2 Chen
      2 Tanaka
      3 Voss
```
