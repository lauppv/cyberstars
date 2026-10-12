crew = ["Tommy", "Boris", "Cara", "Dmitri"]
scores = [88, 100, 47, 73]

total = 0
ok = True
perfect = False
for i in range(len(crew)):
    print(f"{crew[i]}: {scores[i]}")
    total += scores[i]
    if scores[i] < 50:
        ok = False
    if scores[i] == 100:
        perfect = True
desc = list(scores)
desc.sort(reverse=True)
print(f"Sorted: {desc}")
print(f"Total: {total}")
print(f"Average: {round(total / len(scores), 1)}")
print(f"All passed: {ok}")
print(f"Any perfect: {perfect}")
