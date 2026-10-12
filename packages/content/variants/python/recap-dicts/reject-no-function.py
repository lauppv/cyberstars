scores = {"Tommy": 95, "Lance": 42, "Cortez": 88, "Phil": 37, "Mira": 76}
avg = sum(scores.values()) / len(scores)
print(f"Average: {avg}")
print(f"Top: {max(scores, key=scores.get)}")
print("Passing:")
for n in scores:
    if scores[n] >= 50:
        print(n)
