crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
shared = [code for code in crew_a if code in crew_b]
only_a = [code for code in crew_a if code not in crew_b]
combined = crew_a + [code for code in crew_b if code not in crew_a]
one_team = [code for code in crew_a if code not in crew_b] + [code for code in crew_b if code not in crew_a]
print(f"Shared: {len(shared)}")
print(f"Only A: {len(only_a)}")
print(f"Combined: {len(combined)}")
print(f"One team: {len(one_team)}")
