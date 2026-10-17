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

The recursive walk is a few lines. Mark the vertex, then go deep into each neighbour not seen yet. The method gets the list and the marks as parameters, so every call works on the same ones

```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    static void dfs(ArrayList<ArrayList<Integer>> adj, boolean[] seen, int u) {
        seen[u] = true;
        System.out.println("visit " + u);
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                dfs(adj, seen, v);
            }
        }
    }

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

        boolean[] seen = new boolean[n];
        dfs(adj, seen, 0);
    }
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

In Java, an **ArrayDeque** is a stack too: **push** puts an item on top, and **pop** takes the top one off. As a queue it took items in at one end with **add** and out at the other with **poll**; as a stack, **push** and **pop** both work at the same end

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("plate 1");
        stack.push("plate 2");
        stack.push("plate 3");
        System.out.println(stack.pop());
        System.out.println(stack.pop());
        System.out.println(stack.size());
    }
}
```

Output

```text
plate 3
plate 2
1
```

The walk takes a vertex off the top, visits it if it isn't seen yet, and puts its neighbours on. The neighbour put on last is the one taken next, so the walk keeps going deeper. Putting them on from the last neighbour to the first makes the first neighbour come off first, and gives the same order as the recursion

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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

        boolean[] seen = new boolean[n];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (seen[u]) {
                continue;
            }
            seen[u] = true;
            System.out.println("visit " + u);
            for (int i = adj.get(u).size() - 1; i >= 0; i--) {
                int v = adj.get(u).get(i);
                if (!seen[v]) {
                    stack.push(v);
                }
            }
        }
    }
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

Here a vertex is marked when it's taken off, not when it's put on, so **2** can sit on the stack twice: once from **0**, once from **4**. The second time it comes off, it's seen already and skipped. Mark it when it's put on, like breadth-first search does, and on some graphs the order would no longer be the one the recursive walk gives

---

A graph can come in separate **pieces**, called **connected components**: in each one, every vertex can reach every other, and no edge goes from one piece to another. The graph above has three: **0 1 2 3 4**, then **5 6**, then **7** on its own

One walk visits exactly the piece it starts in. So to find every piece, go through the vertices in order, and start a new walk from each vertex no walk has visited yet. Each new walk is a new piece

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static void dfs(ArrayList<ArrayList<Integer>> adj, int[] piece, int u, int p) {
        piece[u] = p;
        for (int v : adj.get(u)) {
            if (piece[v] == 0) {
                dfs(adj, piece, v, p);
            }
        }
    }

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

        int[] piece = new int[n];
        int count = 0;
        for (int v = 0; v < n; v++) {
            if (piece[v] == 0) {
                count++;
                dfs(adj, piece, v, count);
            }
        }

        System.out.println("pieces: " + count);
        System.out.println(Arrays.toString(piece));
    }
}
```

Output

```text
pieces: 3
[1, 1, 1, 1, 1, 2, 2, 3]
```

Instead of **true** and **false**, **piece** holds the number of the piece each vertex is in, with **0** meaning "not visited yet". The pieces are numbered from **1**, in the order of their smallest vertex, since the loop goes through the vertices in order

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
