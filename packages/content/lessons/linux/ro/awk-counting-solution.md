```bash
awk '{sum += $2} END {print sum}' greutate_marfa.txt
awk '{sum += $2} END {print sum}' greutate_marfa.txt > greutate-totala.txt
awk '$2 > 100 {print $1, $2}' greutate_marfa.txt
mkdir punte-zbor
mv greutate-totala.txt punte-zbor/
```

```text
610
oxigen 120
combustibil 300
```
