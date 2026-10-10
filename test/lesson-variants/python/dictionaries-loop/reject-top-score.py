scores = {"Tommy": 88, "Lance": 95, "Cortez": 70}

for name in scores.keys():
    print(name)
for score in scores.values():
    print(score)
total = sum(scores.values())
print(f"Total: {total}")
print(f"Average: {total / len(scores)}")
print(f"Top: {max(scores.values())}")
