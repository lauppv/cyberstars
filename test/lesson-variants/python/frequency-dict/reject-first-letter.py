signals = ["B", "A", "C", "B", "A", "B", "D", "A", "B"]

freq = {}
for signal in signals:
    freq[signal] = freq.get(signal, 0) + 1
for channel in sorted(freq):
    print(f"{channel}: {freq[channel]}")
print(f"Most common: {signals[0]}")
