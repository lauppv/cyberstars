readings = [42, 75, 100, 30, 88, 120, 55, 99]
print(f"Low: {sum(1 for r in readings if r < 50)}")
print(f"Mid: {sum(1 for r in readings if 50 <= r < 100)}")
print(f"High: {sum(1 for r in readings if r >= 100)}")
