```py
n = int(input())

# Start with the first two known values of the sequence.
fib = [0, 1]

# Build the next numbers: each = sum of the last two.
while len(fib) < n:
    next_val = fib[-1] + fib[-2]
    fib.append(next_val)

# Case n == 1: fib has 2 elements, but we only need the first.
result = []
i = 0
while i < n:
    result.append(fib[i])
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
