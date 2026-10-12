```py
n = int(input())
parts = input().split()

# Convert each part from string to integer.
nums = []
i = 0
while i < n:
    nums.append(int(parts[i]))
    i = i + 1

# Assume the first number is the maximum, then compare with the rest.
# If we find something bigger, update the maximum.
maximum = nums[0]
i = 1
while i < n:
    if nums[i] > maximum:
        maximum = nums[i]
    i = i + 1

print(maximum)
```
