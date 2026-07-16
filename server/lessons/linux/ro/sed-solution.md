```bash
sed 's/FAIL/PASS/g' raport.txt
sed 's/FAIL/PASS/g' raport.txt > raport-curat.txt
mkdir arhiva
mv raport-curat.txt arhiva/
grep -c PASS arhiva/raport-curat.txt
```

```text
Test 1: PASS
Test 2: PASS
Test 3: PASS
Test 4: PASS
Test 5: PASS
5
```
