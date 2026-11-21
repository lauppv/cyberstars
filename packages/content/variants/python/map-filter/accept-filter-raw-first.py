readings = [215, 380, 199, 402]
limit = 30
print("Degrees:", list(map(lambda r: r / 10, readings)))
hot = list(map(lambda r: r / 10, filter(lambda r: r > limit * 10, readings)))
print("Too hot:", hot)
print("Count:", len(hot))
