```py
crew = ["Tommy", "Boris", "Cara", "Dmitri"]
scores = [88, 100, 47, 73]

for name, score in zip(crew, scores):
    print(f"{name}: {score}")

print(f"Sorted: {sorted(scores, reverse=True)}")
print(f"Total: {sum(scores)}")
print(f"Average: {round(sum(scores) / len(scores), 1)}")
print(f"All passed: {all(s >= 50 for s in scores)}")
print(f"Any perfect: {any(s == 100 for s in scores)}")
```
