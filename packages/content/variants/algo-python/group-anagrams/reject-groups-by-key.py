n = int(input())
groups = {}
for _ in range(n):
    word = input()
    groups.setdefault("".join(sorted(word)), []).append(word)
for key in sorted(groups):
    print(" ".join(sorted(groups[key])))
