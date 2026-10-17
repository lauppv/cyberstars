# adj[u] lists (v, w) pairs: a cable between u and v that takes w minutes.
def signal_time(adj, s):
    # Write your code here
    return -1


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())
print(signal_time(adj, s))
