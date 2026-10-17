import heapq

count, edges = map(int, input().split())
after = {v: [] for v in range(count)}
waiting = [0] * count
for k in range(edges):
    first, then = map(int, input().split())
    after[first].append(then)
    waiting[then] += 1

ready = [v for v in range(count) if waiting[v] == 0]
heapq.heapify(ready)
plan = []
while ready:
    task = heapq.heappop(ready)
    plan.append(task)
    for nxt in after[task]:
        waiting[nxt] -= 1
        if waiting[nxt] == 0:
            heapq.heappush(ready, nxt)

if len(plan) < count:
    print("No order, there is a cycle")
else:
    print("Order: " + " ".join(map(str, plan)))
