systems = [("Sol", 0, 8), ("Alpha", 4, 3), ("Vega", 25, 5)]
for s in systems:
    print(f"{s[0]}: {s[1]} ly, {s[2]} planets")
print(f"Total planets: {sum(s[2] for s in systems)}")
