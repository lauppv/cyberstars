crew = ["Tommy", "Boris", "Cara", "Dmitri"]
scores = [88, 100, 47, 73]

lines = [f"{n}: {s}" for n, s in zip(crew, scores)]
lines.append(f"Sorted: {sorted(scores, reverse=True)}")
lines.append(f"Total: {sum(scores)}")
lines.append(f"Average: {round(sum(scores) / len(scores), 1)}")
lines.append(f"All passed: {all(map(lambda s: s >= 50, scores))}")
lines.append(f"Any perfect: {any(map(lambda s: s == 100, scores))}")
print("\n".join(lines))
