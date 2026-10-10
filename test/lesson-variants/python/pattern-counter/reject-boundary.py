readings = [42, 75, 100, 30, 88, 120, 55, 99]
low = mid = high = 0
for r in readings:
    if r <= 50:
        low += 1
    elif r <= 100:
        mid += 1
    else:
        high += 1
print(f"Low: {low}")
print(f"Mid: {mid}")
print(f"High: {high}")
