```py
signals = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

freq = {}
for signal in signals:
    if signal in freq:
        freq[signal] += 1
    else:
        freq[signal] = 1

for channel in sorted(freq):
    print(f"{channel}: {freq[channel]}")

best = ""
highest = 0
for channel, count in freq.items():
    if count > highest:
        highest = count
        best = channel
print(f"Most common: {best}")
```
