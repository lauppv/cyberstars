signals = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

counts = {}
for s in signals:
    counts[s] = counts.get(s, 0) + 1
for ch in sorted(counts):
    print(ch + ": " + str(counts[ch]))
print("Most common:", max(counts, key=counts.get))
