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

The adjacency list now keeps a pair for each neighbour: the vertex and the weight of the edge that leads there. In C that's two arrays side by side, **adj** for the vertex and **weight** for the weight, filled at the same spot

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

Finding the smallest unfinished vertex is what a heap is for, like the one you built in the heaps lesson. But with at most **8** vertices, there's no need for one: go through all of them and keep the unfinished one with the smallest **dist**, the way the topological order found the smallest ready vertex. That's **n** checks for each of the **n** steps, quick for a small graph

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int weight[8][8];
    int count[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        adj[u][count[u]] = v;
        weight[u][count[u]] = w;
        count[u]++;
        adj[v][count[v]] = u;
        weight[v][count[v]] = w;
        count[v]++;
    }

    int start = 0;
    int dist[8];
    int done[8] = {0};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[start] = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = 1;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            int w = weight[u][i];
            if (dist[v] == -1 || dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d ", dist[v]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
0 3 1 8 11
```

When no unfinished vertex has a **dist** left, the ones still at **-1** can't be reached at all, so the walk stops: **u** stays **-1**

---

## Mission: Find the Shortest Roads

1. Read an undirected graph with weights with **scanf**: on the first line **n** and **m**, then **m** lines with one edge each, **u v w**, and after them a line with the start vertex **s**
2. Find the shortest distance from **s** to every vertex with Dijkstra's algorithm, picking the next vertex by going through all of them
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
