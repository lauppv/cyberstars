How many handshakes away is a stranger? How many stops between two metro stations? How few moves get you out of a maze? Each time it's the same question about a graph: the **fewest edges** from one vertex to another. The walk that answers it is one you already know from trees

---

The level-order walk took the root, then everything one step below it, then everything two steps below. In a graph there's no root, but you can pick any vertex to start from, and walk outwards from it the same way: first its neighbours, then their neighbours, and so on. That's a **breadth-first search**, or **BFS**

```text
    0 ----- 1 ----- 4
    |       |       |
    |       |       |
    2 ----- 3       5 ----- 6
```

Starting from **0**, the vertices come in rings around it

```text
0 steps    0
1 step     1 2
2 steps    3 4
3 steps    5
4 steps    6
```

The ring a vertex is in is its **distance** from the start: the fewest edges you have to cross to reach it. **3** is two steps from **0**, through **1** or through **2**, whichever way you go

---

The tree walk needs one more thing to work on a graph. A tree has no cycles, so every node is reached once. In a graph, **3** is a neighbour of both **1** and **2**, and **0** is a neighbour of **1**, its own neighbour. Put every neighbour in the queue and the walk visits vertices again and again, and in a cycle it never stops

So keep a **dist** array, one number per vertex, all **-1** at first: **Arrays.fill** sets every cell of an array to one value, meaning "not seen yet". When a vertex is first seen, write its distance there and put it in the queue. A vertex whose distance isn't **-1** any more is never put in again

---

Take the vertex at the front of the queue. Every neighbour not seen yet is one step further from the start than it is. Here is the graph above, in the usual input

```text
7 7
0 1
0 2
1 3
2 3
1 4
4 5
5 6
```

and the walk from **0**

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }

        int start = 0;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(start);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            System.out.println("visit " + u + " at distance " + dist[u]);
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.add(v);
                }
            }
        }
    }
}
```

Output

```text
visit 0 at distance 0
visit 1 at distance 1
visit 2 at distance 1
visit 3 at distance 2
visit 4 at distance 2
visit 5 at distance 3
visit 6 at distance 4
```

Here is the queue after each vertex is taken out and its new neighbours put in

```text
take   new neighbours   queue after
                        [0]
0      1 2              [1, 2]
1      3 4              [2, 3, 4]
2                       [3, 4]
3                       [4]
4      5                [5]
5      6                [6]
6                       []
```

When **2** is taken, its neighbours **0** and **3** are both seen already, so nothing joins. The queue holds at most two distances at a time, the ring being taken and the next one, so the vertices leave it ring by ring

---

A vertex is marked the moment it joins the queue, not when it leaves. Mark it only on leaving, and **3** would join twice, once from **1** and once from **2**, since neither would know the other had already found it

And the distance is right the first time it's written. Every vertex in a ring leaves the queue before any vertex of the next ring, so the first time **v** is found, it's found from a vertex as close to the start as any can be

---

The fewest steps from the start to any vertex **t** is now **dist[t]**. A vertex the walk never reached keeps its **-1**: there's no way to get there at all, which can happen when the graph comes in separate pieces

```text
    0 ----- 1       2 ----- 3
```

From **0**, the distances are **0 1 -1 -1**

---

A graph doesn't always come as a list of edges. A maze is a graph too: every free cell is a vertex, and two free cells side by side, up, down, left or right, are joined by an edge. A grid gives it as rows of text, **.** for a free cell and **#** for a wall, after a line with the number of rows and columns

```text
4 5
..#..
.#...
...#.
#....
```

A cell is a pair, its row **r** and its column **c**, so the queue holds pairs, each an `int[]` of two numbers. Its neighbours aren't stored anywhere: they're the four cells next to it, those that are inside the grid and free

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int cols = scanner.nextInt();
        String[] grid = new String[rows];
        for (int r = 0; r < rows; r++) {
            grid[r] = scanner.next();
        }

        int[][] dist = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            Arrays.fill(dist[r], -1);
        }
        int[][] moves = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        dist[0][0] = 0;
        Queue<int[]> queue = new ArrayDeque<>();
        queue.add(new int[] {0, 0});
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0];
            int c = cell[1];
            for (int[] move : moves) {
                int nr = r + move[0];
                int nc = c + move[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (grid[nr].charAt(nc) == '.' && dist[nr][nc] == -1) {
                        dist[nr][nc] = dist[r][c] + 1;
                        queue.add(new int[] {nr, nc});
                    }
                }
            }
        }

        for (int r = 0; r < rows; r++) {
            String line = "";
            for (int c = 0; c < cols; c++) {
                if (grid[r].charAt(c) == '#') {
                    line += " #";
                } else {
                    line += String.format("%2d", dist[r][c]);
                }
            }
            System.out.println(line);
        }
        System.out.println("steps to the exit: " + dist[rows - 1][cols - 1]);
    }
}
```

For the maze above, the output is

```text
 0 1 # 7 8
 1 # 5 6 7
 2 3 4 # 8
 # 4 5 6 7
steps to the exit: 7
```

**String.format("%2d", x)** writes **x** in two places, so the columns line up. The walk is the same as on the edge list: only how a vertex finds its neighbours has changed

---

## Mission: Count the Steps

1. Read an undirected graph: on the first line **n** and **m**, then **m** lines with one edge each, and after them a line with two vertices, **s** and **t**
2. Find each vertex's distance from **s** with a breadth-first search, using a queue
3. Print one line per vertex, from **0** to **n - 1**: the vertex, a colon, and its distance from **s**, or **-1** if it can't be reached
4. Print **Fewest steps from**, **s**, **to**, **t**, a colon, and the distance, or **No way from**, **s**, **to** and **t** if **t** can't be reached

**n** is from 1 to 8 and the vertices are numbered from 0 to **n - 1**. No edge joins a vertex to itself, and no edge appears twice. **s** and **t** can be the same vertex

**Example**

Input

```text
7 7
0 1
0 2
1 3
2 3
1 4
4 5
5 6
0 6
```

Output

```text
0: 0
1: 1
2: 1
3: 2
4: 2
5: 3
6: 4
Fewest steps from 0 to 6: 4
```

**Example**

Input

```text
5 3
0 1
1 2
3 4
2 4
```

Output

```text
0: 2
1: 1
2: 0
3: -1
4: -1
No way from 2 to 4
```
