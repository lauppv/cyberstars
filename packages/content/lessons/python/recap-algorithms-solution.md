```py
results = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]

wins = {}
for name in results:
    if name in wins:
        wins[name] += 1
    else:
        wins[name] = 1

champion = ""
highest = 0
for name, count in wins.items():
    if count > highest:
        highest = count
        champion = name
print(f"Champion: {champion} ({highest} wins)")

leaderboard = []
for name, count in wins.items():
    leaderboard.append((count, name))

for i in range(len(leaderboard)):
    max_index = i
    for j in range(i + 1, len(leaderboard)):
        if leaderboard[j][0] > leaderboard[max_index][0]:
            max_index = j
    leaderboard[i], leaderboard[max_index] = leaderboard[max_index], leaderboard[i]

print("=== LEADERBOARD ===")
for i in range(len(leaderboard)):
    count, name = leaderboard[i]
    print(f"{i + 1}. {name} - {count} wins")
```
