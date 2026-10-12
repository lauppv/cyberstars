from collections import Counter

signals = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

tally = Counter(signals)
for letter in sorted(tally):
    print(f"{letter}: {tally[letter]}")
print(f"Most common: {tally.most_common(1)[0][0]}")
