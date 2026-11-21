readings = [215, 380, 199, 402]
limit = 30
degrees = [r / 10 for r in readings]
hot = [d for d in degrees if d > limit]
print(f"Degrees: {degrees}")
print(f"Too hot: {hot}")
print(f"Count: {len(hot)}")
