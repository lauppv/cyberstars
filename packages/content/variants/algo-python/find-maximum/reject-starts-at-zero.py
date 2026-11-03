input()
best = 0
for x in map(int, input().split()):
    if x > best:
        best = x
print(best)
