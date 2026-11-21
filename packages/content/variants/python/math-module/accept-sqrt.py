from math import sqrt, pi, ceil

x = 300
y = 400
radius = 1000
print("Distance: " + format(sqrt(x ** 2 + y ** 2), ".2f") + " km")
length = pi * radius * 2
print("Orbit: " + format(length, ".2f") + " km")
print("Fuel cells: " + str(ceil(length / 500)))
