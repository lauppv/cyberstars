def signature(word):
    counts = [0] * 26
    for ch in word:
        counts[ord(ch) - 97] += 1
    return tuple(counts)


words = [input() for _ in range(int(input()))]
groups = {}
for w in words:
    groups.setdefault(signature(w), []).append(w)
for g in sorted(sorted(g) for g in groups.values()):
    print(*g)
