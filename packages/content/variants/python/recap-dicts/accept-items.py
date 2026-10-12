scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}


def analyze(data):
    out = {"average": 0, "top": None, "passing": []}
    best = None
    total = 0
    for name, pts in data.items():
        total += pts
        if best is None or pts > best:
            best = pts
            out["top"] = name
        if not pts < 50:
            out["passing"].append(name)
    out["average"] = total / len(data)
    return out


r = analyze(scores)
print(f"Average: {r['average']}")
print(f"Top: {r['top']}")
print("Passing:")
i = 0
while i < len(r["passing"]):
    print(r["passing"][i])
    i += 1
