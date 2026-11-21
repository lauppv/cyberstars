```py
import math

x = 300
y = 400
radius = 1000

orbit = 2 * math.pi * radius
print(f"Distance: {math.hypot(x, y):.2f} km")
print(f"Orbit: {orbit:.2f} km")
print(f"Fuel cells: {math.ceil(orbit / 500)}")
```
