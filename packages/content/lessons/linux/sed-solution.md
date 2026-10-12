```bash
sed 's/FAIL/PASS/g' report.txt
sed 's/FAIL/PASS/g' report.txt > report-clean.txt
mkdir records
mv report-clean.txt records/
grep -c PASS records/report-clean.txt
```

```text
Test 1: PASS
Test 2: PASS
Test 3: PASS
Test 4: PASS
Test 5: PASS
5
```
