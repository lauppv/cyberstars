n = int(input())
groups = {}
for _ in range(n):
    word = input()
    groups.setdefault("".join(sorted(word)), []).append(word)
for g in groups.values():
    print(" ".join(g))
