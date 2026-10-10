team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]
names_b = set(n for n, s in team_b)
print("In both:")
for n, s in team_a:
    if n in names_b:
        print(n)
print(f"Team A high: {[s for n, s in team_a if s > 80]}")
print("Matches:")
pairs = [(na, nb, sa) for na, sa in team_a for nb, sb in team_b if sa == sb]
for na, nb, score in pairs:
    print(f"{na} and {nb} both scored {score}")
