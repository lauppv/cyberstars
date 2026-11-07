```bash
mkdir punte-zbor
awk '{sum += $2} END {print sum}' greutate_marfa.txt > punte-zbor/greutate-totala.txt
awk '$2 > 100 {print $1, $2}' greutate_marfa.txt > punte-zbor/grele.txt
cat punte-zbor/greutate-totala.txt punte-zbor/grele.txt
```

```text
610
oxigen 120
combustibil 300
```
