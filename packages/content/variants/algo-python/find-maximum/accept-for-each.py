input()
best = None
for x in map(int, input().split()):
    if best is None or x > best:
        best = x
print(best)
