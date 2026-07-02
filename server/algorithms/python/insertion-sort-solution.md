```py
n = int(input())
nums = list(map(int, input().split()))

for i in range(1, len(nums)):
    key = nums[i]
    j = i - 1
    while j >= 0 and nums[j] > key:
        nums[j + 1] = nums[j]
        j -= 1
    nums[j + 1] = key

print(' '.join(str(x) for x in nums))
```
