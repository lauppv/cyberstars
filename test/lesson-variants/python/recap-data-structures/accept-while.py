team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]

others = set(n for n, _ in team_b)
print("In both:")
for n, _ in team_a:
    if n in others:
        print(n)
print(f"Team A high: {[s for _, s in team_a if s > 80]}")
print("Matches:")
i = 0
while i < len(team_a):
    j = 0
    while j < len(team_b):
        if team_a[i][1] == team_b[j][1]:
            print(f"{team_a[i][0]} and {team_b[j][0]} both scored {team_a[i][1]}")
        j += 1
    i += 1
