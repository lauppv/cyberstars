from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())

piece = [0] * n


def dfs(u, p):
    piece[u] = p
    for v, w in adj[u]:
        if piece[v] == 0:
            dfs(v, p)


pieces = 0
for v in range(n):
    if piece[v] == 0:
        pieces += 1
        dfs(v, pieces)

steps = [-1] * n
steps[s] = 0
queue = deque()
queue.append(s)
while len(queue) > 0:
    u = queue.popleft()
    for v, w in adj[u]:
        if steps[v] == -1:
            steps[v] = steps[u] + 1
            queue.append(v)

dist = [-1] * n
dist[s] = 0
done = [False] * n
for step in range(n):
    u = -1
    for v in range(n):
        if not done[v] and dist[v] != -1 and (u == -1 or dist[v] < dist[u]):
            u = v
    if u == -1:
        break
    done[u] = True
    for v, w in adj[u]:
        if dist[v] == -1 or dist[u] + w < dist[v]:
            dist[v] = dist[u] + w

print("Pieces:", pieces)
print("Steps:", *steps)
print("Distances:", *dist)
