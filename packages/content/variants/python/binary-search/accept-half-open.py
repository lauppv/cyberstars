ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
queries = [23, 50, 8, 91, 100]


def binary_search(numbers, target):
    lo, hi = 0, len(numbers)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if numbers[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    if lo < len(numbers) and numbers[lo] == target:
        return lo
    return -1


results = [binary_search(ids, q) for q in queries]
for q, i in zip(queries, results):
    print(f"{q} -> not found" if i == -1 else f"{q} -> index {i}")
print(f"Found: {sum(1 for i in results if i != -1)}")
