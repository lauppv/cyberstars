import math as m

x = 300
y = 400
radius = 1000
print(f"Distance: {m.sqrt(x * x + y * y):.2f} km")
print(f"Orbit: {2 * m.pi * radius:.2f} km")
print(f"Fuel cells: {m.ceil(2 * m.pi * radius / 500)}")
