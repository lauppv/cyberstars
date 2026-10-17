Breadth-first search spreads out like a ripple, one ring at a time. There's another way to explore: pick a way and follow it as far as it goes, and only when you're stuck, step back to the last place where you had a choice. That's how you'd explore a cave, and it's a **depth-first search**, or **DFS**

---

You've walked a tree this way already: the pre-order walk goes down the left side all the way before it comes back for the right. On a graph it's the same walk, with the **seen** marks breadth-first search needed, since a graph can lead you back to a vertex you've already visited

```visual
{"use": "dfs-back"}
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

The recursive walk is a few lines. Mark the vertex, then go deep into each neighbour not seen yet

```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

seen = [False] * n


def dfs(u):
    seen[u] = True
    print("visit", u)
    for v in adj[u]:
        if not seen[v]:
            dfs(v)


dfs(0)
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

```visual
{"use": "dfs-calls"}
```

**2** is a neighbour of **0**, but it's visited last: the walk reached it the long way round, through **1**, **3** and **4**, before **0** got to it. Breadth-first search would visit **0 1 2 3 4**. Both reach the same vertices, only the order differs

And **5**, **6** and **7** are never visited: no edge leads to them from **0**

---

The recursion keeps track of where to go back to: each open call is a place where a choice is still left. You can keep track of that yourself with a **stack**, a pile where the last thing put on is the first taken off, like a stack of plates

In Python, a list is a stack: **append** puts an item on top, and **pop()** takes the top one off

```py
stack = []
stack.append("plate 1")
stack.append("plate 2")
stack.append("plate 3")
print(stack.pop())
print(stack.pop())
print(len(stack))
```

Output

```text
plate 3
plate 2
1
```

The walk takes a vertex off the top, visits it if it isn't seen yet, and puts its neighbours on. The neighbour put on last is the one taken next, so the walk keeps going deeper. Putting them on in **reversed** order makes the first neighbour come off first, and gives the same order as the recursion

```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

seen = [False] * n
stack = [0]
while len(stack) > 0:
    u = stack.pop()
    if seen[u]:
        continue
    seen[u] = True
    print("visit", u)
    for v in reversed(adj[u]):
        if not seen[v]:
            stack.append(v)
```

Output

```text
visit 0
visit 1
visit 3
visit 4
visit 2
```

```visual
{"use": "dfs-stack"}
```

Here a vertex is marked when it's taken off, not when it's put on, so **2** can sit on the stack twice: once from **0**, once from **4**. The second time it comes off, it's seen already and skipped. Mark it when it's put on, like breadth-first search does, and on some graphs the order would no longer be the one the recursive walk gives

---

A graph can come in separate **pieces**, called **connected components**: in each one, every vertex can reach every other, and no edge goes from one piece to another. The graph above has three: **0 1 2 3 4**, then **5 6**, then **7** on its own

One walk visits exactly the piece it starts in. So to find every piece, go through the vertices in order, and start a new walk from each vertex no walk has visited yet. Each new walk is a new piece

```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

piece = [0] * n


def dfs(u, p):
    piece[u] = p
    for v in adj[u]:
        if piece[v] == 0:
            dfs(v, p)


count = 0
for v in range(n):
    if piece[v] == 0:
        count += 1
        dfs(v, count)

print("pieces:", count)
print(piece)
```

Output

```text
pieces: 3
[1, 1, 1, 1, 1, 2, 2, 3]
```

Here are the three walks, one piece each

```visual
{"use": "dfs-pieces"}
```

Instead of **True** and **False**, **piece** holds the number of the piece each vertex is in, with **0** meaning "not visited yet". The pieces are numbered from **1**, in the order of their smallest vertex, since the loop goes through the vertices in order

This is how a map app knows two places can't be reached from each other, or how a network finds the computers cut off from the rest

---

## Mission: Find the Pieces

1. Read an undirected graph: on the first line **n** and **m**, then **m** lines with one edge each
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
