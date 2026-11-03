a = input()
b = input()
counts = {}
for ch in a:
    counts[ch] = counts.get(ch, 0) + 1
for ch in b:
    counts[ch] = counts.get(ch, 0) - 1
print(all(v == 0 for v in counts.values()))
