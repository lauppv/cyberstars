input()
seen = set()
kept = []
for x in input().split():
    if x not in seen:
        seen.add(x)
        kept.append(x)
print(" ".join(kept))
