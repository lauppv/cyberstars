Socks before shoes. The walls before the roof. The first course before the second one, which needs it. Many jobs are made of tasks where some must wait for others, and the question is always the same: in what order can you do them all, so that nothing starts before what it waits for?

---

That's a directed graph. Each task is a vertex, and an edge **u v** means "**u** must come before **v**"

```text
    0 ----> 1 ----> 3
    |               ^
    v               |
    2 ----> 4 ------+
            |
            v
            5
```

```text
6 6
0 1
1 3
0 2
2 4
4 3
4 5
```

**3** waits for both **1** and **4**. **0** waits for nothing, so it can go first

An order of all the vertices where every edge points forward, from a vertex to one later in the list, is a **topological order**. **0 1 2 4 3 5** is one. **0 2 4 5 1 3** is another: a graph can have many. **0 1 3 2 4 5** isn't one, since **3** comes before **4**, which it waits for

---

How many tasks a vertex waits for is the number of edges coming into it, its **in-degree**. Count it while reading the edges: each edge **u v** adds one to the in-degree of **v**

```text
vertex      0  1  2  3  4  5
in-degree   0  1  1  2  1  1
```

A vertex with in-degree **0** waits for nothing: it's ready. Do it, and every task waiting for it waits for one task less, so take one off the in-degree of each vertex its edges lead to. Some of them reach **0** and become ready in turn. Keep going until every vertex is done

That's **Kahn's algorithm**. When several vertices are ready at once, any of them can go next, and each choice gives another order. To get one answer every time, take the **smallest** ready vertex

```text
take   in-degrees after (0 1 2 3 4 5)   ready
       0 1 1 2 1 1                      0
0      - 0 0 2 1 1                      1 2
1      - - 0 1 1 1                      2
2      - - - 1 0 1                      4
4      - - - 0 - 0                      3 5
3      - - - - - 0                      5
5      - - - - - -
```

The order is **0 1 2 4 3 5**

---

With at most **8** vertices, the smallest ready vertex can be found by going through all of them, from **0** up, and stopping at the first one not done yet with in-degree **0**

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int count[8] = {0};
    int indeg[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        indeg[v]++;
    }

    int done[8] = {0};
    int order[8];
    int size = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && indeg[v] == 0) {
                u = v;
                break;
            }
        }
        done[u] = 1;
        order[size] = u;
        size++;
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]--;
        }
    }

    printf("order:");
    for (int i = 0; i < size; i++) {
        printf(" %d", order[i]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
order: 0 1 2 4 3 5
```

Each of the **n** steps takes one vertex, so after **n** steps every vertex is in the order. With thousands of tasks, going through all of them at every step gets slow, and the ready ones are kept in a queue instead, or in a heap when the smallest has to come first

---

Not every graph has an order. Suppose **1** waits for **3**, **3** for **2**, and **2** for **1**

```text
    0 ----> 1 ----> 2
            ^       |
            |       v
            +------ 3
```

```text
4 4
0 1
1 2
2 3
3 1
```

They wait for each other in a circle, a **cycle**, so none of them can ever go first. After **0** is done, no vertex is ready, though three aren't done yet

Kahn's algorithm notices it by itself: when no vertex is ready before every vertex is done, the ones left sit on a cycle. In the code above, **u** stays **-1**. So stop there, and check whether the order holds every vertex: **size == n** is **1** when it does and **0** when it doesn't

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int count[8] = {0};
    int indeg[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        indeg[v]++;
    }

    int done[8] = {0};
    int order[8];
    int size = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && indeg[v] == 0) {
                u = v;
                break;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = 1;
        order[size] = u;
        size++;
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]--;
        }
    }

    printf("done:");
    for (int i = 0; i < size; i++) {
        printf(" %d", order[i]);
    }
    printf("\n");
    printf("all done: %d\n", size == n);
    return 0;
}
```

Output

```text
done: 0
all done: 0
```

That's how a build tool tells you two parts of a program need each other, or a spreadsheet that two cells are computed from each other

---

## Mission: Plan the Tasks

1. Read a directed graph with **scanf**: on the first line **n** and **m**, then **m** lines with one edge **u v** each, meaning **u** must come before **v**
2. Find a topological order with Kahn's algorithm, taking the smallest ready vertex each time
3. If every vertex gets a place, print **Order:** and the order
4. If not, print **No order, there is a cycle**

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. No edge joins a vertex to itself, and no edge appears twice. **m** can be 0

**Example**

Input

```text
5 5
3 1
1 0
4 0
2 4
3 2
```

Output

```text
Order: 3 1 2 4 0
```

**Example**

Input

```text
4 4
0 1
1 2
2 3
3 1
```

Output

```text
No order, there is a cycle
```
