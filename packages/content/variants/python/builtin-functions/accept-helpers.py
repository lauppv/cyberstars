crew = ["Tommy", "Boris", "Cara", "Dmitri"]
scores = [88, 100, 47, 73]

pairs = list(zip(crew, scores))
for who, pts in pairs:
    print(who + ": " + str(pts))

total = sum(scores)
ranked = sorted(scores, reverse=True)
print("Sorted:", ranked)
print("Total:", total)
print("Average:", round(total / len(scores), 1))
print("All passed:", all([p >= 50 for p in scores]))
print("Any perfect:", any(p == 100 for p in scores))
