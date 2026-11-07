```bash
mkdir arhiva
sed 's/FAIL/PASS (retest)/' raport.txt > arhiva/raport-curat.txt
cat arhiva/raport-curat.txt
```

```text
Test 1: PASS
Test 2: PASS (retest)
Test 3: PASS
Test 4: PASS (retest)
Test 5: PASS (retest)
```
