import collections

text = "go to the moon and to the stars and back"
words = text.split(" ")
c = collections.Counter(words)
print("Words:", len(words))
print("Different:", len(set(words)))
print("Top: " + ", ".join(w + " " + str(n) for w, n in c.most_common(3)))
groups = collections.defaultdict(list)
for w in dict.fromkeys(words):
    groups[w[0]].append(w)
for letter in sorted(groups.keys()):
    print(letter + ": " + " ".join(groups[letter]))
