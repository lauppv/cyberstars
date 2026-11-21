x = 300
y = 400
radius = 1000

pi = 3.141592653589793
orbit = 2 * pi * radius
cells = orbit / 500
if cells > int(cells):
    cells = int(cells) + 1
else:
    cells = int(cells)
print(f"Distance: {(x * x + y * y) ** 0.5:.2f} km")
print(f"Orbit: {orbit:.2f} km")
print(f"Fuel cells: {cells}")
