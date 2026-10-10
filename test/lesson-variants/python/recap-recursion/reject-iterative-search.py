sector = [[0, 1], [2, 0]]

def flat(grid):
    if not grid:
        return []
    return grid[0] + flat(grid[1:])

def count_beacons(sector):
    total = 0
    for row in sector:
        for cell in row:
            if cell == 2:
                total += 1
    return total

def flatten_sorted(sector):
    return sorted(set(flat(sector)))

def find_value(sorted_list, target):
    lo, hi = 0, len(sorted_list) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_list[mid] == target:
            return True
        if sorted_list[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False

print(f"Beacons: {count_beacons(sector)}")
flat_values = flatten_sorted(sector)
print(f"Unique values: {flat_values}")
print(f"Has beacon value: {find_value(flat_values, 2)}")
print(f"Has value 3: {find_value(flat_values, 3)}")
