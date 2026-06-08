sector = [
[0, 1, 0, 0, 0],
[0, 1, 0, 1, 0],
[0, 0, 0, 1, 0],
[1, 1, 0, 0, 0],
[0, 0, 0, 1, 2],
]

def count_beacons(sector): # nested loops: count how many cells equal 2
    pass

def flatten_sorted(sector): # collapse the grid into a sorted list of unique values
    pass

def find_value(sorted_list, target): # recursive binary search: return True if target is in the list, else False
    pass

print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
