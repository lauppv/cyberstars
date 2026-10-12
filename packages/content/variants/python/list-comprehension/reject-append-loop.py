readings = [75, 30, 95, 88, 42, 92]

high = []
doubled = []
passing = []
for r in readings:
    if r > 80:
        high.append(r)
    doubled.append(r * 2)
    if r >= 50:
        passing.append(r)
print(high)
print(doubled)
print(passing)
