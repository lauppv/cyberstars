distances = [800, 750, 1200, 1200, 1500]
count = 0
for i, d in enumerate(distances):
    if i == 0 or d > max(distances[:i]):
        count += 1
        print(f"Day {i + 1}: {d} new best")
    else:
        print(f"Day {i + 1}: {d}")
print("Best days:", count)
