text = "the ship left the moon at dawn"
lengths = {}
starts = []
for w in text.split():
    lengths[w] = len(w)
    if len(w) > 3 and w[0] not in starts:
        starts.append(w[0])
print(f"Lengths: {lengths}")
print(f"Starts: {sorted(starts)}")
