n = int(input())
groups = {}
for _ in range(n):
    word = input()
    groups.setdefault(frozenset(word), []).append(word)
for g in sorted(sorted(g) for g in groups.values()):
    print(" ".join(g))
