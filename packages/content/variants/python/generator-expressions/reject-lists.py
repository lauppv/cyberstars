prices = [4, 10, 25]
counts = [3, 0, 2]
lines = [p * c for p, c in zip(prices, counts)]
print(f"Total: {sum(lines)}")
print(f"Biggest line: {max(lines)}")
print(f"Empty lines: {any([c == 0 for c in counts])}")
print(f"All cheap: {all([p < 20 for p, c in zip(prices, counts) if c > 0])}")
