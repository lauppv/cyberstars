readings = [42, 75, 100, 30, 88, 120, 55, 99]
a = b = c = 0
for x in readings:
    if x < 50:
        a += 1
for x in readings:
    if 50 <= x <= 99:
        b += 1
for x in readings:
    if x > 99:
        c += 1
print("Low:", a)
print("Mid:", b)
print("High:", c)
