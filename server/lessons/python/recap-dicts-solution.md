```py
scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}

def analyze(scores):
    total = 0
    for score in scores.values():
        total = total + score
    average = total / len(scores)

    top = ""
    highest = 0
    for name in scores:
        if scores[name] > highest:
            highest = scores[name]
            top = name

    passing = []
    for name in scores:
        if scores[name] >= 50:
            passing.append(name)

    return {"average": average, "top": top, "passing": passing}

report = analyze(scores)
print(f"Average: {report['average']}")
print(f"Top: {report['top']}")
print("Passing:")
for name in report["passing"]:
    print(name)
```
