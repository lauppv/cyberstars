```py
n = int(input())
parts = input().split()

nums = []
i = 0
while i < n:
    nums.append(int(parts[i]))
    i = i + 1

# For each number, we linearly check if we've already put it in the result.
# If not, we add it; if yes, we skip it.
result = []
i = 0
while i < n:
    num = nums[i]

    already_seen = False
    j = 0
    while j < len(result):
        if result[j] == num:
            already_seen = True
            break
        j = j + 1

    if not already_seen:
        result.append(num)

    i = i + 1

# Build the output manually, separated by spaces.
out = ""
i = 0
while i < len(result):
    out = out + str(result[i])
    if i < len(result) - 1:
        out = out + " "
    i = i + 1

print(out)
```
