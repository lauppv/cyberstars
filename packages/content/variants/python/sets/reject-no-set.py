crew_a = ["A1", "B2", "C3"]
crew_b = ["B2", "D4", "E5"]
shared = [code for code in crew_a if code in crew_b]
print(f"Shared: {len(shared)}")
code = input("Signal code: ")
if code in shared:
    print("Confirmed by both")
elif code in crew_a or code in crew_b:
    print("Detected by one")
else:
    print("Not detected")
