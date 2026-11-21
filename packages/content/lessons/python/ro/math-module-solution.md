```py
import math

x = 300
y = 400
raza = 1000

orbita = 2 * math.pi * raza
print(f"Distanta: {math.hypot(x, y):.2f} km")
print(f"Orbita: {orbita:.2f} km")
print(f"Celule de combustibil: {math.ceil(orbita / 500)}")
```
