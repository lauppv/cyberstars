crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
a = set(crew_a)
b = set(crew_b)
print(f"Shared: {len(a & b)}")
print(f"Only A: {len(a - b)}")
print(f"Combined: {len(a | b)}")
print(f"One team: {len(a ^ b)}")
