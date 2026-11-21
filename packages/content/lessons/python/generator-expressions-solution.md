```py
prices = [4, 10, 25]
counts = [3, 0, 2]

print(f"Total: {sum(p * c for p, c in zip(prices, counts))}")
print(f"Biggest line: {max(p * c for p, c in zip(prices, counts))}")
print(f"Empty lines: {any(c == 0 for c in counts)}")
print(f"All cheap: {all(p < 20 for p, c in zip(prices, counts) if c > 0)}")
```
