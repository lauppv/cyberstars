prices = [4, 10, 25]
counts = [3, 0, 2]
total = 0
for p, c in zip(prices, counts):
    total += p * c
print(f"Total: {total}")
print(f"Biggest line: {max((p * c for p, c in zip(prices, counts)))}")
print(f"Empty lines: {any(c == 0 for c in counts)}")
print(f"All cheap: {all(p < 20 or c == 0 for p, c in zip(prices, counts))}")
