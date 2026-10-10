systems = [("Sol", 0, 8), ("Alpha", 4, 3), ("Vega", 25, 5)]
total = 0
for name, distance, planets in systems:
    print(f"{name}: {distance} ly, {planets} planets")
    total += distance
print(f"Total planets: {total}")
