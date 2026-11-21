from collections import Counter, defaultdict

text = "go to the moon and to the stars and back"
words = text.split()
counts = Counter(words)
print(f"Words: {len(words)}")
print(f"Different: {len(counts)}")
print("Top: " + ", ".join(f"{w} {n}" for w, n in counts.most_common(3)))
groups = defaultdict(list)
for w in words:
    groups[w[0]].append(w)
for k in sorted(groups):
    print(f"{k}: {' '.join(groups[k])}")
