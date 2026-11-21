text = "go to the moon and to the stars and back"

words = text.split()
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(f"Words: {len(words)}")
print(f"Different: {len(counts)}")

ranked = sorted(counts.items(), key=lambda pair: -pair[1])
top = []
for word, count in ranked[:3]:
    top.append(f"{word} {count}")
print(f"Top: {', '.join(top)}")

groups = {}
for word in words:
    group = groups.setdefault(word[0], [])
    if word not in group:
        group.append(word)
for letter in sorted(groups):
    print(f"{letter}: {' '.join(groups[letter])}")
