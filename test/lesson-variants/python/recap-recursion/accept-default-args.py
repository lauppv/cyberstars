sector = [[0, 1], [2, 0]]

def count_beacons(sector):
    beacons = 0
    for line in sector:
        for x in line:
            if x == 2:
                beacons = beacons + 1
    return beacons

def flatten_sorted(sector):
    seen = set()
    for line in sector:
        for x in line:
            seen.add(x)
    out = list(seen)
    out.sort()
    return out

def find_value(sorted_list, target, lo=0, hi=None):
    if hi is None:
        hi = len(sorted_list)
    if lo >= hi:
        return False
    m = (lo + hi) // 2
    if sorted_list[m] == target:
        return True
    if sorted_list[m] > target:
        return find_value(sorted_list, target, lo, m)
    return find_value(sorted_list, target, m + 1, hi)

print("Beacons:", count_beacons(sector))
flat = flatten_sorted(sector)
print("Unique values:", flat)
print("Has beacon value:", find_value(flat, 2))
print("Has value 3:", find_value(flat, 3))
