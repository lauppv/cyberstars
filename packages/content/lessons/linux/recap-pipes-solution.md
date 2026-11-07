```bash
echo "TELEMETRY REPORT" > report.txt
grep WARN telemetry.raw | sort >> report.txt
grep ERR telemetry.raw | sort >> report.txt
echo "-- end of report --" >> report.txt
cat report.txt
```

```text
TELEMETRY REPORT
WARN: antenna misaligned
WARN: coolant pressure dropping
WARN: fuel cell B low
ERR: backup power offline
ERR: gyroscope fault
-- end of report --
```
