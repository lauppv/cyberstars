Breadth-first search spreads out like a ripple, one ring at a time. There's another way to explore: pick a way and follow it as far as it goes, and only when you're stuck, step back to the last place where you had a choice. That's how you'd explore a cave, and it's a **depth-first search**, or **DFS**

---

You've walked a tree this way already: the pre-order walk goes down the left side all the way before it comes back for the right. On a graph it's the same walk, with the **seen** marks breadth-first search needed, since a graph can lead you back to a vertex you've already visited

```text
    0 ----- 1       5
    |       |       |
    |       |       |
    2       3       6
     \     /
      \   /         7
        4
```

Here are its **8** vertices and **6** edges in the usual input

```text
8 6
0 1
0 2
1 3
2 4
3 4
5 6
```

---

The recursive walk is a few lines. Mark the vertex, then go deep into each neighbour not seen yet. The arrays sit outside **main**, so **dfs** can reach them without taking them as parameters, and C starts such arrays at zero

```c
#include <stdio.h>

int adj[8][8];
int count[8];
int seen[8];

void dfs(int u) {
    seen[u] = 1;
    printf("visit %d\n", u);
    for (int i = 0; i < count[u]; i++) {
        int v = adj[u][i];
        if (!seen[v]) {
            dfs(v);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    dfs(0);
    return 0;
}
```

Output

```text
visit 0
visit 1
visit 3
visit 4
visit 2
```

Each call stays open until everything reachable from its vertex is done. Here is how deep the calls go

```text
dfs(0)                 neighbours 1, 2
  dfs(1)               neighbours 0, 3
    dfs(3)             neighbours 1, 4
      dfs(4)           neighbours 2, 3
        dfs(2)         neighbours 0, 4: both seen, go back
      back in dfs(4)   3 is seen, go back
    back in dfs(3)     nothing left, go back
  back in dfs(1)       nothing left, go back
back in dfs(0)         2 is seen now, done
```

**2** is a neighbour of **0**, but it's visited last: the walk reached it the long way round, through **1**, **3** and **4**, before **0** got to it. Breadth-first search would visit **0 1 2 3 4**. Both reach the same vertices, only the order differs

And **5**, **6** and **7** are never visited: no edge leads to them from **0**

---

The recursion keeps track of where to go back to: each open call is a place where a choice is still left. You can keep track of that yourself with a **stack**, a pile where the last thing put on is the first taken off, like a stack of plates

In C, a stack is an array and one index, **top**, the number of items on it. Putting an item on writes it at **top** and moves **top** up; taking one off moves **top** down and reads it there

```c
#include <stdio.h>

int main(void) {
    int stack[10];
    int top = 0;

    stack[top] = 1;
    top++;
    stack[top] = 2;
    top++;
    stack[top] = 3;
    top++;

    top--;
    printf("%d\n", stack[top]);
    top--;
    printf("%d\n", stack[top]);
    printf("%d\n", top);
    return 0;
}
```

Output

```text
3
2
1
```

The walk takes a vertex off the top, visits it if it isn't seen yet, and puts its neighbours on. The neighbour put on last is the one taken next, so the walk keeps going deeper. Putting them on from the last neighbour to the first makes the first neighbour come off first, and gives the same order as the recursion

```c
#include <stdio.h>

int adj[8][8];
int count[8];

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    int seen[8] = {0};
    int stack[64];
    int top = 0;
    stack[top] = 0;
    top++;
    while (top > 0) {
        top--;
        int u = stack[top];
        if (seen[u]) {
            continue;
        }
        seen[u] = 1;
        printf("visit %d\n", u);
        for (int i = count[u] - 1; i >= 0; i--) {
            int v = adj[u][i];
            if (!seen[v]) {
                stack[top] = v;
                top++;
            }
        }
    }
    return 0;
}
```

Output

```text
visit 0
visit 1
visit 3
visit 4
visit 2
```

```text
take   stack after
       [0]
0      [2, 1]
1      [2, 3]
3      [2, 4]
4      [2, 2]
2      [2]
2      []        seen already, skipped
```

Here a vertex is marked when it's taken off, not when it's put on, so **2** can sit on the stack twice: once from **0**, once from **4**. A vertex can go on once for every edge that reaches it, which is why the stack has room for **64**, more than any graph here can need. The second time it comes off, it's seen already and skipped. Mark it when it's put on, like breadth-first search does, and on some graphs the order would no longer be the one the recursive walk gives

---

A graph can come in separate **pieces**, called **connected components**: in each one, every vertex can reach every other, and no edge goes from one piece to another. The graph above has three: **0 1 2 3 4**, then **5 6**, then **7** on its own

One walk visits exactly the piece it starts in. So to find every piece, go through the vertices in order, and start a new walk from each vertex no walk has visited yet. Each new walk is a new piece

```c
#include <stdio.h>

int adj[8][8];
int count[8];
int piece[8];

void dfs(int u, int p) {
    piece[u] = p;
    for (int i = 0; i < count[u]; i++) {
        int v = adj[u][i];
        if (piece[v] == 0) {
            dfs(v, p);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    int pieces = 0;
    for (int v = 0; v < n; v++) {
        if (piece[v] == 0) {
            pieces++;
            dfs(v, pieces);
        }
    }

    printf("pieces: %d\n", pieces);
    for (int v = 0; v < n; v++) {
        printf("%d ", piece[v]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
pieces: 3
1 1 1 1 1 2 2 3
```

Instead of **1** and **0**, **piece** holds the number of the piece each vertex is in, with **0** meaning "not visited yet". The pieces are numbered from **1**, in the order of their smallest vertex, since the loop goes through the vertices in order

This is how a map app knows two places can't be reached from each other, or how a network finds the computers cut off from the rest

---

## Mission: Find the Pieces

1. Read an undirected graph with **scanf**: on the first line **n** and **m**, then **m** lines with one edge each
2. Find its pieces with a recursive depth-first search
3. Print **Pieces:** and how many there are
4. Print one line per piece, numbered from **1** in the order of their smallest vertex: **Piece**, its number, a colon, and its vertices from smallest to largest

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. No edge joins a vertex to itself, and no edge appears twice. **m** can be 0

**Example**

Input

```text
8 6
0 1
0 2
1 3
2 4
3 4
5 6
```

Output

```text
Pieces: 3
Piece 1: 0 1 2 3 4
Piece 2: 5 6
Piece 3: 7
```

**Example**

Input

```text
6 3
4 0
2 5
5 3
```

Output

```text
Pieces: 3
Piece 1: 0 4
Piece 2: 1
Piece 3: 2 3 5
```
