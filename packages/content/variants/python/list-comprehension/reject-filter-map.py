readings = [75, 30, 95, 88, 42, 92]

high = list(filter(lambda r: r > 80, readings))
doubled = list(map(lambda r: r * 2, readings))
passing = list(filter(lambda r: r >= 50, readings))
print(high)
print(doubled)
print(passing)
