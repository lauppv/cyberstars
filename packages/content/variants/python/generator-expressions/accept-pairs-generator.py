prices = [4, 10, 25]
counts = [3, 0, 2]
lines = (p * c for p, c in zip(prices, counts))
print("Total:", sum(lines))
print("Biggest line:", max(prices[i] * counts[i] for i in range(len(prices))))
print("Empty lines:", 0 in counts)
print("All cheap:", not any(p >= 20 and c > 0 for p, c in zip(prices, counts)))
