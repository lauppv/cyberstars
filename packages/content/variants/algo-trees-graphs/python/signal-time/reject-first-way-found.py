from collections import deque


# adj[u] lists (v, w) pairs: a cable between u and v that takes w minutes.
def signal_time(adj, s):
    dist = [-1] * len(adj)
    dist[s] = 0
    queue = deque([s])
    while queue:
        u = queue.popleft()
        for v, w in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + w
                queue.append(v)
    if -1 in dist:
        return -1
    return max(dist)


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())
print(signal_time(adj, s))
