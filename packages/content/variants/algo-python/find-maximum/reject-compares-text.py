input()
words = input().split()
best = words[0]
for w in words:
    if w > best:
        best = w
print(best)
