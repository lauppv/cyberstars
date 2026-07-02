```py
n = int(input())
nums = list(map(int, input().split()))

seen = set()
result = []
for num in nums:
    if num not in seen:
        seen.add(num)
        result.append(num)

print(' '.join(str(x) for x in result))
```
