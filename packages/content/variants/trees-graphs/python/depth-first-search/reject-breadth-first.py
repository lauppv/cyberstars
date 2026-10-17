from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

piece = [0] * n
count = 0
for s in range(n):
    if piece[s] == 0:
        count += 1
        piece[s] = count
        queue = deque([s])
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if piece[v] == 0:
                    piece[v] = count
                    queue.append(v)

print(f"Pieces: {count}")
for p in range(1, count + 1):
    print(f"Piece {p}:", *[v for v in range(n) if piece[v] == p])
