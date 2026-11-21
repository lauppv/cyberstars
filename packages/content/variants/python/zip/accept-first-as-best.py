names = ["Kai", "Mila", "Tom"]
before = [60, 75, 80]
after = [72, 70, 95]
winner = None
for name, x, y in zip(names, before, after):
    d = y - x
    print(f"{name}: {x} -> {y} ({'+' if d >= 0 else '-'}{abs(d)})")
    if winner is None or d > winner[1]:
        winner = (name, d)
print(f"Most improved: {winner[0]}")
