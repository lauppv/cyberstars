team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]
names_b = set()
for n, s in team_b:
    names_b.add(n)
print("In both:")
for n, s in team_a:
    if n in names_b:
        print(n)
high = []
for n, s in team_a:
    if s > 80:
        high.append(s)
print(f"Team A high: {high}")
print("Matches:")
for na, sa in team_a:
    for nb, sb in team_b:
        if sa == sb:
            print(f"{na} and {nb} both scored {sa}")
