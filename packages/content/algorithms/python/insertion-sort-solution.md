```py
n = int(input())
parts = input().split()

nums = []
i = 0
while i < n:
    nums.append(int(parts[i]))
    i = i + 1

# At step i, the first i elements are already sorted.
# We take the element at position i and "insert" it in order
# by shifting to the right any element bigger than it.
i = 1
while i < n:
    current = nums[i]

    j = i - 1
    while j >= 0 and nums[j] > current:
        nums[j + 1] = nums[j]
        j = j - 1

    nums[j + 1] = current
    i = i + 1

# Build the output manually, separated by spaces.
out = ""
i = 0
while i < n:
    out = out + str(nums[i])
    if i < n - 1:
        out = out + " "
    i = i + 1

print(out)
```
