results = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]

tally = {}
for who in results:
    tally[who] = tally.get(who, 0) + 1

best = None
for who in tally:
    if best is None or tally[who] > tally[best]:
        best = who
print(f"Champion: {best} ({tally[best]} wins)")

board = [(tally[w], w) for w in tally]
n = len(board)
for a in range(n - 1):
    top = a
    for b in range(a + 1, n):
        if board[b][0] > board[top][0]:
            top = b
    if top != a:
        board[a], board[top] = board[top], board[a]

print("=== LEADERBOARD ===")
for pos, (cnt, who) in enumerate(board, start=1):
    print(f"{pos}. {who} - {cnt} wins")
