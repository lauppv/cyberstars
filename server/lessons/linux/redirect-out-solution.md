```bash
grep critical sensors.log > alerts.txt
grep ok sensors.log > healthy.txt
mkdir report
mv alerts.txt healthy.txt report/
cat report/alerts.txt
```

```text
critical: pressure drop deck 7
critical: radiation spike lab 3
```
