```py
nums = list(map(int, input().split()))
target = int(input())

seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)
        break
    seen[num] = i
```
