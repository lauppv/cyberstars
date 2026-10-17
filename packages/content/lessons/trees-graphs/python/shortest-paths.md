Breadth-first search finds the way with the fewest edges. On a map, that's not always the way you want. A motorway with three exits can be quicker than one narrow road straight across the mountain. When every edge has its own length, the question becomes: which way has the smallest **total**?

---

Give every edge a number, its **weight**: a length in kilometres, a time in minutes, a price. In the input, each edge line gets a third number, the weight

```visual
{"use": "dijkstra-roads"}
```

```text
5 6
0 1 4
0 2 1
1 2 2
1 3 5
2 3 8
3 4 3
```

The roads go both ways, so the graph is undirected. From **0** to **3**, the fewest edges is two, **0 1 3** or **0 2 3**, and both cost **9**. But **0 2 1 3** costs **1 + 2 + 5 = 8**: one edge more, and shorter. Counting edges isn't enough any more

---

The adjacency list now keeps a pair for each neighbour: the vertex and the weight of the edge that leads there

```visual
{"use": "dijkstra-list"}
```

---

**Dijkstra's algorithm** finds the shortest distance from a start vertex to every other one. It keeps a **dist** for each vertex: the shortest way found so far, or **-1** while there's none. At first only the start has one, **0**

Then, again and again: take the vertex with the smallest **dist** that isn't finished yet, and mark it finished. For each of its neighbours, see whether going through it is shorter than what the neighbour has. If it is, that's the neighbour's new **dist**

```visual
{"use": "dijkstra-dist"}
```

**1** first gets **4**, straight from **0**. When **2** is taken, the way through it costs **1 + 2 = 3**, so **1** drops to **3**. **3** gets **9** through **2**, then **8** through **1**

The vertex taken is never improved later. All weights are positive, so any other way to it would go through a vertex that isn't finished, whose **dist** is at least as big, and then add more. That's also why Dijkstra's algorithm needs weights of **0** or more: a negative edge could make a finished vertex cheaper after all

---

Finding the smallest unfinished vertex is a job for a heap, the one from the heaps lesson. Python's **heapq** keeps it in a list: **heapq.heappush** puts a value in, **heapq.heappop** takes the smallest out. Put pairs in it, **(distance, vertex)**, and the smallest distance comes out first, since pairs compare by their first item

```py
import heapq

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))

start = 0
dist = [-1] * n
dist[start] = 0
heap = [(0, start)]
while len(heap) > 0:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    for v, w in adj[u]:
        if dist[v] == -1 or d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(heap, (dist[v], v))

print(dist)
```

Output

```text
[0, 3, 1, 8, 11]
```

A heap can't change a value already inside it, so when **1** drops from **4** to **3**, the new pair goes in and the old one stays. It comes out later, after **1** is finished, and **d > dist[u]** spots it and skips it

```text
take      heap after, smallest first
          (0, 0)
(0, 0)    (1, 2) (4, 1)
(1, 2)    (3, 1) (4, 1) (9, 3)
(3, 1)    (4, 1) (8, 3) (9, 3)
(4, 1)    (8, 3) (9, 3)             old, skipped
(8, 3)    (9, 3) (11, 4)
(9, 3)    (11, 4)                   old, skipped
(11, 4)
```

---

## Mission: Find the Shortest Roads

1. Read an undirected graph with weights: on the first line **n** and **m**, then **m** lines with one edge each, **u v w**, and after them a line with the start vertex **s**
2. Find the shortest distance from **s** to every vertex with Dijkstra's algorithm, using a heap
3. Print one line per vertex, from **0** to **n - 1**: the vertex, a colon, and its distance from **s**, or **-1** if it can't be reached

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. Each weight is a whole number from 1 to 100. No edge joins a vertex to itself, and no two vertices are joined twice. **m** can be 0

**Example**

Input

```text
5 6
0 1 4
0 2 1
1 2 2
1 3 5
2 3 8
3 4 3
0
```

Output

```text
0: 0
1: 3
2: 1
3: 8
4: 11
```

**Example**

Input

```text
6 5
0 1 7
1 2 1
0 2 10
2 3 2
4 5 3
3
```

Output

```text
0: 10
1: 3
2: 2
3: 0
4: -1
5: -1
```
