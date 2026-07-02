```py
n = int(input())
words = [input() for _ in range(n)]

groups = {}
for word in words:
    key = ''.join(sorted(word))
    groups.setdefault(key, []).append(word)

result = [sorted(group) for group in groups.values()]
result.sort(key=lambda group: group[0])

for group in result:
    print(' '.join(group))
```
