results = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]
wins = {}
for name in results:
    wins[name] = wins.get(name, 0) + 1
board = sorted(((c, n) for n, c in wins.items()), reverse=True)
print(f"Champion: {board[0][1]} ({board[0][0]} wins)")
print("=== LEADERBOARD ===")
for i, (c, n) in enumerate(board, 1):
    print(f"{i}. {n} - {c} wins")
