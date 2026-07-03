```bash
awk '{sum += $2} END {print sum}' cargo_weight.txt
```

```text
610
```
