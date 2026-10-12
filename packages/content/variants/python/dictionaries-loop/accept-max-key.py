scores = {"Tommy": 88, "Lance": 95, "Cortez": 70}

for member in scores.keys():
    print(member)
for points in scores.values():
    print(points)
total = sum(scores.values())
print("Total:", total)
print("Average:", total / len(scores))
print("Top:", max(scores, key=scores.get))
