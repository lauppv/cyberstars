ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
queries = [23, 50, 8, 91, 100]


def binary_search(numbers, target, lo=0, hi=None):
    if hi is None:
        hi = len(numbers)
    if lo >= hi:
        return -1
    m = (lo + hi) // 2
    if numbers[m] == target:
        return m
    if numbers[m] < target:
        return binary_search(numbers, target, m + 1, hi)
    return binary_search(numbers, target, lo, m)


hits = 0
for q in queries:
    pos = binary_search(ids, q)
    if pos >= 0:
        hits += 1
        print(q, "-> index", pos)
    else:
        print(q, "-> not found")
print("Found:", hits)
