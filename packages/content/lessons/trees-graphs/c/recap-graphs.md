Put the graph lessons together: one map, read once, and three questions about it, each answered by the walk made for it

---

A quick reminder of the pieces

- **Reading a graph**: **n** and **m** on the first line, then one edge per line; a weighted edge has a third number, its weight
- **Adjacency list**: one row of an array per vertex, a count of how many neighbours it holds, and a second array beside it for the weights; in an undirected graph each edge goes in both rows
- **Breadth-first search**: a queue made of an array, **head** and **tail**, and a **-1** for every vertex not seen yet; it gives the fewest edges from the start
- **Depth-first search**: a recursive function that marks a vertex and calls itself on each neighbour not marked yet; a new walk from every vertex no walk has reached counts the pieces
- **Dijkstra's algorithm**: at every step, go through all the vertices and take the unfinished one with the smallest distance; it gives the smallest total weight from the start

---

## Mission: Survey the Map

1. Read an undirected graph with weights with **scanf**: on the first line **n** and **m**, then **m** lines with one edge each, **u v w**, and after them a line with the start vertex **s**
2. Count the graph's pieces with a recursive depth-first search, and print **Pieces:** and how many there are
3. Find the fewest edges from **s** to every vertex with a breadth-first search, using a queue, and print **Steps:** and the numbers, from vertex **0** to **n - 1**
4. Find the shortest distance from **s** to every vertex with Dijkstra's algorithm, picking the next vertex by going through all of them, and print **Distances:** and the numbers, from vertex **0** to **n - 1**

A vertex that can't be reached from **s** gets **-1** on both lines

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. Each weight is a whole number from 1 to 100. No edge joins a vertex to itself, and no two vertices are joined twice. **m** can be 0

**Example**

Input

```text
6 6
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
Pieces: 2
Steps: 0 1 1 2 3 -1
Distances: 0 3 1 8 11 -1
```

**Example**

Input

```text
5 4
0 1 10
0 2 1
2 3 1
3 1 1
0
```

Output

```text
Pieces: 2
Steps: 0 1 1 2 -1
Distances: 0 3 1 2 -1
```
