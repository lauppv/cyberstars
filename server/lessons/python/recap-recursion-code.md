sector = [
[0, 1, 0, 0, 0],
[0, 1, 0, 1, 0],
[0, 0, 0, 1, 0],
[1, 1, 0, 0, 0],
[0, 0, 0, 1, 2],
]

def count_beacons(sector):
    pass

def flatten_sorted(sector):
    pass

def find_value(sorted_list, target):
    pass

print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
