```py
ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
queries = [23, 50, 8, 91, 100]

def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1
    while left <= right:
        mid = (left + right) // 2
        if numbers[mid] == target:
            return mid
        elif numbers[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

found = 0
for query in queries:
    index = binary_search(ids, query)
    if index == -1:
        print(f"{query} -> not found")
    else:
        print(f"{query} -> index {index}")
        found += 1
print(f"Found: {found}")
```
