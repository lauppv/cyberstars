```bash
sort -k2 -n power_readings.txt
sort -k2 -n power_readings.txt > diagnostics.txt
mkdir engineering
mv diagnostics.txt engineering/
head -n 1 engineering/diagnostics.txt
```

```text
epsilon 5
gamma 50
beta 120
alpha 300
delta 800
epsilon 5
```
