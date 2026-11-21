from collections import Counter, defaultdict

text = "go to the moon and to the stars and back"
words = text.split()
counts = Counter(words)
print(f"Words: {len(words)}")
print(f"Different: {len(counts)}")
top = sorted(counts.items(), key=lambda p: (-p[1], p[0]))[:3]
print("Top: " + ", ".join(f"{w} {n}" for w, n in top))
groups = defaultdict(list)
for w in counts:
    groups[w[0]].append(w)
for k in sorted(groups):
    print(f"{k}: {' '.join(groups[k])}")
