crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
team_a = set(crew_a)
team_b = set(crew_b)
shared = team_a & team_b
print(f"Shared: {len(shared)}")
code = input("Signal code: ")
if code in shared:
    print("Confirmed by both")
elif code in team_a or code in team_b:
    print("Detected by one")
else:
    print("Not detected")
