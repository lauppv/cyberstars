scores = {"Tommy": 88, "Lance": 95, "Cortez": 70}

for name in scores:
    print(name)
for name in scores:
    print(scores[name])
total = 0
for name in scores:
    total += scores[name]
print(f"Total: {total}")
print(f"Average: {total / len(scores)}")
print(f"Top: {max(scores, key=lambda n: scores[n])}")
