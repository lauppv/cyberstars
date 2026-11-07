```bash
mkdir engineering
sort -k2 -n power_readings.txt > engineering/diagnostics.txt
head -n 1 engineering/diagnostics.txt > engineering/weakest.txt
cat engineering/diagnostics.txt
```

```text
epsilon 5
gamma 50
beta 120
alpha 300
delta 800
```
