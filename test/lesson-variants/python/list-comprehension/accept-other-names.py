readings = [75, 30, 95, 88, 42, 92]

above_80 = [value for value in readings if value > 80]
twice = [2 * value for value in readings]
ok = [value for value in readings if not value < 50]

print(above_80)
print(twice)
print(ok)
