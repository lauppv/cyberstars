```py
from collections import Counter, defaultdict

text = "go to the moon and to the stars and back"

words = text.split()
counts = Counter(words)
print(f"Words: {len(words)}")
print(f"Different: {len(counts)}")

top = []
for word, count in counts.most_common(3):
    top.append(f"{word} {count}")
print(f"Top: {', '.join(top)}")

groups = defaultdict(list)
for word in words:
    if word not in groups[word[0]]:
        groups[word[0]].append(word)
for letter in sorted(groups):
    print(f"{letter}: {' '.join(groups[letter])}")
```
