scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}


def analyze(scores):
    return {
        "average": sum(scores.values()) / len(scores),
        "top": max(scores, key=scores.get),
        "passing": [n for n in scores if scores[n] > 50],
    }


rep = analyze(scores)
print(f"Average: {rep['average']}")
print(f"Top: {rep['top']}")
print("Passing:")
for n in rep["passing"]:
    print(n)
