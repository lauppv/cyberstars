```py
readings = [215, 380, 199, 402]
limit = 30

degrees = list(map(lambda r: r / 10, readings))
too_hot = list(filter(lambda d: d > limit, degrees))

print(f"Degrees: {degrees}")
print(f"Too hot: {too_hot}")
print(f"Count: {len(too_hot)}")
```
