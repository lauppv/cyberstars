readings = [45, 82, 67, 91, 38, 74, 55, 96, 12, 60]

result = [min(x + 5, 100) for x in readings if x >= 50]
count = len(result)
print("Boosted:", result)
print("Stable reactors:", count)
print("Average:", round(sum(result) / count))
