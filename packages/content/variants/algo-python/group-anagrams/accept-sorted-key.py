n = int(input())
groups = {}
for _ in range(n):
    word = input()
    groups.setdefault("".join(sorted(word)), []).append(word)
lines = [sorted(g) for g in groups.values()]
lines.sort(key=lambda g: g[0])
for g in lines:
    print(" ".join(g))
