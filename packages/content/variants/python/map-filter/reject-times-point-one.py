readings = [215, 380, 199, 402]
limit = 30
degrees = list(map(lambda r: r * 0.1, readings))
hot = list(filter(lambda d: d > limit, degrees))
print(f"Degrees: {degrees}")
print(f"Too hot: {hot}")
print(f"Count: {len(hot)}")
