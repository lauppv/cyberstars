crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
team_a = set()
team_b = set()
for code in crew_a:
    team_a.add(code)
for code in crew_b:
    team_b.add(code)
shared = team_a & team_b
print("Shared:", len(shared))
code = input("Signal code: ")
if code in shared:
    print("Confirmed by both")
elif code in team_a or code in team_b:
    print("Detected by one")
else:
    print("Not detected")
