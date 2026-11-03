n = int(input())
m = [input().split() for _ in range(n)]
seen = [[False] * n for _ in range(n)]
moves = [(0, 1), (1, 0), (0, -1), (-1, 0)]
r = c = d = 0
out = []
for _ in range(n * n):
    out.append(m[r][c])
    seen[r][c] = True
    nr, nc = r + moves[d][0], c + moves[d][1]
    if not (0 <= nr < n and 0 <= nc < n) or seen[nr][nc]:
        d = (d + 1) % 4
        nr, nc = r + moves[d][0], c + moves[d][1]
    r, c = nr, nc
print(" ".join(out))
