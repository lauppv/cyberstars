sector = [[0, 1], [2, 0]]

def count_beacons(sector):
    total = 0
    for row in sector:
        for cell in row:
            if cell == 2:
                total += 1
    return total

def flatten_sorted(sector):
    return sorted(set(c for row in sector for c in row))

def find_value(sorted_list, target):
    return target in sorted_list

print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
