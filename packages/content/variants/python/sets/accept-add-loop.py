crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
a = set()
b = set()
for code in crew_a:
    a.add(code)
for code in crew_b:
    b.add(code)
print("Shared:", len(a & b))
print("Only A:", len(a - b))
print("Combined:", len(a | b))
print("One team:", len(a ^ b))
