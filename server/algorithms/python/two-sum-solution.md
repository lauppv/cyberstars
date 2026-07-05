```py
parts = input().split()

nums = []
i = 0
while i < len(parts):
    nums.append(int(parts[i]))
    i = i + 1

target = int(input())

# For each number, the "complement" is what's missing to reach the target.
# We save each seen number in a dictionary together with its index,
# so we can quickly check if we've already seen the complement.
seen = {}

i = 0
while i < len(nums):
    num = nums[i]
    complement = target - num

    if complement in seen:
        print(seen[complement], i)
        break

    seen[num] = i
    i = i + 1
```
