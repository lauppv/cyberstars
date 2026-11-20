```py
crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]

team_a = set(crew_a)
team_b = set(crew_b)

print(f"Shared: {len(team_a & team_b)}")
print(f"Only A: {len(team_a - team_b)}")
print(f"Combined: {len(team_a | team_b)}")
print(f"One team: {len(team_a ^ team_b)}")
```
