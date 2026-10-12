sector = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2],
]


def count_beacons(grid):
    n = 0
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            n += grid[i][j] == 2
    return n


def flatten_sorted(grid):
    return sorted({v for line in grid for v in line})


def search(values, x, lo, hi):
    if lo > hi:
        return False
    mid = (lo + hi) // 2
    if values[mid] == x:
        return True
    if values[mid] < x:
        return search(values, x, mid + 1, hi)
    return search(values, x, lo, mid - 1)


def find_value(sorted_list, target):
    return search(sorted_list, target, 0, len(sorted_list) - 1)


print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
