team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]

b_set = {member[0] for member in team_b}
print("In both:")
for member in team_a:
    if member[0] in b_set:
        print(member[0])
high = [m[1] for m in team_a if m[1] > 80]
print("Team A high:", high)
print("Matches:")
for a in team_a:
    for b in team_b:
        if a[1] == b[1]:
            print(a[0], "and", b[0], "both scored", a[1])
