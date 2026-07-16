```bash
awk '{print $1, $3}' senzori.dat
awk '{print $1, $3}' senzori.dat > citire.txt
mkdir jurnal-senzori
mv citire.txt jurnal-senzori/
sort -k2 -n jurnal-senzori/citire.txt
```

```text
alpha 72
beta 101
gamma 15
delta 68
epsilon 99
gamma 15
delta 68
alpha 72
epsilon 99
beta 101
```
