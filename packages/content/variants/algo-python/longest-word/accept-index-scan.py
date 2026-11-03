words = input().split()
best = 0
for i in range(1, len(words)):
    if len(words[i]) > len(words[best]):
        best = i
print(words[best])
