scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}


def analyze(scores):
    print(f"Average: {sum(scores.values()) / len(scores)}")
    print(f"Top: {max(scores, key=scores.get)}")
    print("Passing:")
    for name, pts in scores.items():
        if pts >= 50:
            print(name)


analyze(scores)
