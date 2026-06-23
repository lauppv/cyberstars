```py
scores = {
    "Tommy": 88,
    "Lance": 95,
    "Cortez": 70,
    "Phil": 90,
    "Ken": 65,
    "Sonny": 78,
    "Diaz": 84,
    "Avery": 72,
    "Umberto": 60,
    "Mercedes": 83
}

for name in scores.keys():
    print(name)

for score in scores.values():
    print(score)

total = 0
for score in scores.values():
    total = total + score
print(f"Total: {total}")

print(f"Average: {total / len(scores)}")

top = ""
best = 0
for name in scores:
    if scores[name] > best:
        best = scores[name]
        top = name
print(f"Top: {top}")
```
