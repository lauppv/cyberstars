n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)

state = [0] * n
order = []
cycle = False


def visit(u):
    global cycle
    state[u] = 1
    for v in adj[u]:
        if state[v] == 1:
            cycle = True
        elif state[v] == 0:
            visit(v)
    state[u] = 2
    order.append(u)


for v in range(n):
    if state[v] == 0:
        visit(v)

if cycle:
    print("No order, there is a cycle")
else:
    print("Order:", *reversed(order))
