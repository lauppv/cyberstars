results = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]
wins = {}
for name in results:
    wins[name] = wins.get(name, 0) + 1
champ = max(wins, key=wins.get)
print(f"Champion: {champ} ({wins[champ]} wins)")
board = [(c, n) for n, c in wins.items()]
for i in range(len(board)):
    m = i
    for j in range(i + 1, len(board)):
        if board[j][0] < board[m][0]:
            m = j
    board[i], board[m] = board[m], board[i]
print("=== LEADERBOARD ===")
for i, (c, n) in enumerate(board, 1):
    print(f"{i}. {n} - {c} wins")
