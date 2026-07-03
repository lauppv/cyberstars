```bash
grep WARN telemetry.raw | sort > warnings_sorted.txt
echo "-- end of report --" >> warnings_sorted.txt
cat warnings_sorted.txt
```

```text
WARN: antenna misaligned
WARN: coolant pressure dropping
WARN: fuel cell B low
-- end of report --
```
