```bash
mkdir jurnal-senzori
awk '{print $1, $3}' senzori.dat | sort -k2 -n > jurnal-senzori/citire.txt
cat jurnal-senzori/citire.txt
```

```text
gamma 15
delta 68
alpha 72
epsilon 99
beta 101
```
