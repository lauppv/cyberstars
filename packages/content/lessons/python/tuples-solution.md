```py
systems = [("Sol", 0, 8), ("Alpha", 4, 3), ("Vega", 25, 5)]

total_planets = 0
for system in systems:
    name, distance, planets = system
    print(f"{name}: {distance} ly, {planets} planets")
    total_planets = total_planets + planets

print(f"Total planets: {total_planets}")
```
