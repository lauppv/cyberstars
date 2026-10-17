A tree has one rule that keeps it tidy: there's exactly one way down from the root to each node. Drop that rule. Let any node link to any other, let the links go round in circles, and don't pick a root at all. What you get is a **graph**, and it's how a program sees a map, a group of friends, or the tasks of a project

---

A graph is made of **vertices**, the points, and **edges**, the links between two of them. Two vertices joined by an edge are **neighbours**

```text
    0 ----- 1
    |     / |
    |    /  |
    |   /   |
    2       3 ----- 4
```

This graph has **5** vertices, numbered from **0** to **4**, and **5** edges: 0-1, 0-2, 1-2, 1-3 and 3-4. Vertex **1** has three neighbours, **0**, **2** and **3**. Vertex **4** has only one, **3**

Unlike a tree, a graph can go round in a circle: from **0** to **1** to **2** and back to **0**. That's a **cycle**

---

The edges above work both ways, like a two-way street: if **0** is joined to **1**, then **1** is joined to **0**. That's an **undirected** graph

Some links only go one way, like a one-way street, or following someone online who doesn't follow you back. Then the edges have arrows, and the graph is **directed**

```text
    0 ----> 1
    ^       |
    |       v
    3 <---- 2
```

Here you can go from **0** to **1**, but not from **1** straight back to **0**. Each edge is written from where it starts to where it ends: 0-1, 1-2, 2-3, 3-0

---

A program can't read a picture, so every graph in this course comes in the same shape: on the first line the number of vertices **n** and the number of edges **m**, then one edge per line, the two vertices it joins

```text
5 5
0 1
0 2
1 2
1 3
3 4
```

That's the graph in the first picture. The vertices are always numbered from **0** to **n - 1**, so a vertex's number can be used straight away as an index

**scanf** with **%d** skips spaces and line breaks before a number, so the whole input reads one number at a time

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    printf("vertices: %d\n", n);
    printf("edges: %d\n", m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        printf("edge from %d to %d\n", u, v);
    }
    return 0;
}
```

For the input above, the output is

```text
vertices: 5
edges: 5
edge from 0 to 1
edge from 0 to 2
edge from 1 to 2
edge from 1 to 3
edge from 3 to 4
```

---

Reading the edges is one thing. To work with the graph, you have to keep them, so that you can ask questions like "are **1** and **3** joined?" or "who are the neighbours of **1**?". There are two usual ways

The first is an **adjacency matrix**: a table with one row and one column per vertex. The cell at row **u**, column **v** holds **1** if **u** and **v** are joined, and **0** if they aren't

```text
       0  1  2  3  4
   0   0  1  1  0  0
   1   1  0  1  1  0
   2   1  1  0  0  0
   3   0  1  0  0  1
   4   0  0  0  1  0
```

In an undirected graph each edge fills two cells, **[u][v]** and **[v][u]**, so the table is the same on both sides of the diagonal

C has no table that grows to fit, so make it as big as the largest graph you expect. The graphs in these lessons have at most **8** vertices, so `int matrix[8][8]` is enough, and `= {0}` starts every cell at zero. Only the first **n** rows and columns are used

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int matrix[8][8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        matrix[u][v] = 1;
        matrix[v][u] = 1;
    }

    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            printf("%d ", matrix[u][v]);
        }
        printf("\n");
    }

    printf("%d\n", matrix[1][3]);
    printf("%d\n", matrix[2][4]);
    return 0;
}
```

For the input above, the output is

```text
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
1
0
```

The matrix answers "are they joined?" in one step. But it takes **n × n** cells even when there are few edges, and to find a vertex's neighbours you have to go through its whole row

---

The second way is an **adjacency list**: for each vertex, a list of its neighbours

```text
0: 1 2
1: 0 2 3
2: 0 1
3: 1 4
4: 3
```

C has no list that grows, so build one from arrays: row **v** of `adj` holds the neighbours of **v**, and `count[v]` says how many of them there are so far. A vertex has at most **n - 1** neighbours, so a row of **8** is enough. Adding **x** to the list of **v** writes it at the end of the row and moves the end along

```text
adj[v][count[v]] = x;
count[v]++;
```

Each edge **u v** adds **v** to the list of **u** and, since the graph is undirected, **u** to the list of **v**

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int count[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    for (int v = 0; v < n; v++) {
        printf("%d:", v);
        for (int i = 0; i < count[v]; i++) {
            printf(" %d", adj[v][i]);
        }
        printf("\n");
    }

    printf("neighbours of 1: %d\n", count[1]);
    return 0;
}
```

For the input above, the output is

```text
0: 1 2
1: 0 2 3
2: 0 1
3: 1 4
4: 3
neighbours of 1: 3
```

Only the first **count[v]** spots of a row hold neighbours, so **adj** itself needs no zeros: the loops never read past the count

The list keeps only the edges that exist, and a vertex's neighbours are right there, in the order their edges were read. That's what most graph walks need, so the next lessons use it the most

---

In a directed graph, an edge **u v** only goes from **u** to **v**: it fills just **matrix[u][v]**, and it adds **v** to the list of **u** and nothing to the list of **v**

```text
input        list          matrix
4 4          0: 1          0 1 0 0
0 1          1: 2          0 0 1 0
1 2          2: 3          0 0 0 1
2 3          3: 0          1 0 0 0
3 0
```

That's the graph with the arrows from earlier

---

## Mission: Map the Network

1. Read an undirected graph with **scanf**: on the first line **n** and **m**, then **m** lines with one edge each
2. Keep it in two ways: an adjacency matrix and an adjacency list
3. Print **Matrix:**, then the matrix, one row per line, with the values separated by spaces
4. Print **List:**, then one line per vertex, from **0** to **n - 1**: the vertex, a colon, and its neighbours in the order their edges were read

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. No edge joins a vertex to itself, and no edge appears twice. **m** can be 0

**Example**

Input

```text
5 5
0 1
0 2
1 2
1 3
3 4
```

Output

```text
Matrix:
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
List:
0: 1 2
1: 0 2 3
2: 0 1
3: 1 4
4: 3
```

**Example**

Input

```text
4 3
2 0
3 1
1 2
```

Output

```text
Matrix:
0 0 1 0
0 0 1 1
1 1 0 0
0 1 0 0
List:
0: 2
1: 3 2
2: 0 1
3: 1
```
