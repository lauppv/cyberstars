```py
team_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
team_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]

team_b_names = set()
for name, score in team_b:
    team_b_names.add(name)

print("In both:")
for name, score in team_a:
    if name in team_b_names:
        print(name)

team_a_high = [score for name, score in team_a if score > 80]
print(f"Team A high: {team_a_high}")

print("Matches:")
for name_a, score_a in team_a:
    for name_b, score_b in team_b:
        if score_a == score_b:
            print(f"{name_a} and {name_b} both scored {score_a}")
```
