```py
sector = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2],
]

def count_beacons(sector):
    total = 0
    for row in sector:
        for cell in row:
            if cell == 2:
                total += 1
    return total

def flatten_sorted(sector):
    values = []
    for row in sector:
        for cell in row:
            if cell not in values:
                values.append(cell)
    return sorted(values)

def find_value(sorted_list, target):
    if len(sorted_list) == 0:
        return False
    mid = len(sorted_list) // 2
    if sorted_list[mid] == target:
        return True
    elif sorted_list[mid] < target:
        return find_value(sorted_list[mid + 1:], target)
    else:
        return find_value(sorted_list[:mid], target)

print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
```
