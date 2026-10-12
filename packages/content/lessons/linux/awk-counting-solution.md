```bash
awk '{sum += $2} END {print sum}' cargo_weight.txt
awk '{sum += $2} END {print sum}' cargo_weight.txt > total-weight.txt
awk '$2 > 100 {print $1, $2}' cargo_weight.txt
mkdir flight-deck
mv total-weight.txt flight-deck/
```

```text
610
oxygen 120
fuel 300
```
