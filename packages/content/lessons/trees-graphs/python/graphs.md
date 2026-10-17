A tree has one rule that keeps it tidy: there's exactly one way down from the root to each node. Drop that rule. Let any node link to any other, let the links go round in circles, and don't pick a root at all. What you get is a **graph**, and it's how a program sees a map, a group of friends, or the tasks of a project

---

A graph is made of **vertices**, the points, and **edges**, the links between two of them. Two vertices joined by an edge are **neighbours**

```visual
{"use": "graph-parts"}
```

This graph has **5** vertices, numbered from **0** to **4**, and **5** edges: 0-1, 0-2, 1-2, 1-3 and 3-4. Vertex **1** has three neighbours, **0**, **2** and **3**. Vertex **4** has only one, **3**

Unlike a tree, a graph can go round in a circle: from **0** to **1** to **2** and back to **0**. That's a **cycle**

---

The edges above work both ways, like a two-way street: if **0** is joined to **1**, then **1** is joined to **0**. That's an **undirected** graph

Some links only go one way, like a one-way street, or following someone online who doesn't follow you back. Then the edges have arrows, and the graph is **directed**

```visual
{"use": "graph-directed"}
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

**input()** reads one line as text. **split()** cuts it at the spaces, and **map(int, ...)** turns each piece into a number

```py
n, m = map(int, input().split())
print("vertices:", n)
print("edges:", m)
for i in range(m):
    u, v = map(int, input().split())
    print("edge from", u, "to", v)
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

```visual
{"use": "graph-matrix"}
```

In an undirected graph each edge fills two cells, **[u][v]** and **[v][u]**, so the table is the same on both sides of the diagonal

```py
n, m = map(int, input().split())
matrix = [[0] * n for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    matrix[u][v] = 1
    matrix[v][u] = 1

for row in matrix:
    print(*row)

print(matrix[1][3] == 1)
print(matrix[2][4] == 1)
```

For the input above, the output is

```text
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
True
False
```

**print(\*row)** prints the items of a list separated by spaces. And build the rows with a loop, as above: `[[0] * n] * n` looks the same, but it's one row repeated **n** times, so writing a cell changes the whole column

The matrix answers "are they joined?" in one step. But it takes **n × n** cells even when there are few edges, and to find a vertex's neighbours you have to go through its whole row

---

The second way is an **adjacency list**: for each vertex, a list of its neighbours. In Python, that's a list of lists, one per vertex

```visual
{"use": "graph-list"}
```

Each edge **u v** adds **v** to the list of **u** and, since the graph is undirected, **u** to the list of **v**

```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

for v in range(n):
    print(f"{v}:", *adj[v])

print("neighbours of 1:", len(adj[1]))
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

The list keeps only the edges that exist, and a vertex's neighbours are right there, in the order their edges were read. That's what most graph walks need, so the next lessons use it the most

---

In a directed graph, an edge **u v** only goes from **u** to **v**: it fills just **matrix[u][v]**, and it adds **v** to the list of **u** and nothing to the list of **v**

```visual
{"use": "graph-directed-store"}
```

That's the graph with the arrows from earlier

---

## Mission: Map the Network

1. Read an undirected graph: on the first line **n** and **m**, then **m** lines with one edge each
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
