readings = [75, 30, 95, 88, 42, 92]

results = (
    [x for x in readings if x > 80],
    [x + x for x in readings],
    [x for x in readings if x >= 50],
)
print(*results, sep="\n")
