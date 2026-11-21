from collections import Counter, defaultdict

text = "go to the moon and to the stars and back"
counts = Counter(text.split())
print(f"Words: {sum(counts.values())}")
print(f"Different: {len(counts)}")
print("Top:", ", ".join(f"{w} {n}" for w, n in counts.most_common(3)))
by = defaultdict(list)
for w in counts:
    by[w[0]].append(w)
for k in "abcdefghijklmnopqrstuvwxyz":
    if k in by:
        print(f"{k}: {' '.join(by[k])}")
