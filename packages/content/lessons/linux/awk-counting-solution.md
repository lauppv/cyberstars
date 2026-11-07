```bash
mkdir flight-deck
awk '{sum += $2} END {print sum}' cargo_weight.txt > flight-deck/total-weight.txt
awk '$2 > 100 {print $1, $2}' cargo_weight.txt > flight-deck/heavy.txt
cat flight-deck/total-weight.txt flight-deck/heavy.txt
```

```text
610
oxygen 120
fuel 300
```
