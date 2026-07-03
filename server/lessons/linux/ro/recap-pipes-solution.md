```bash
grep WARN telemetrie.raw | sort > warnings_sorted.txt
echo "-- end of report --" >> warnings_sorted.txt
cat warnings_sorted.txt
```

```text
WARN: antena dezaliniata
WARN: celula de combustibil B scazuta
WARN: presiune agent de racire in scadere
-- end of report --
```
