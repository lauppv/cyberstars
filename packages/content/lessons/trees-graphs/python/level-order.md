The depth-first walks dive: they go all the way down one side of the tree before they come back for the other. Sometimes you want the opposite. The root first, then everything one step below it, then everything two steps below, the way you'd read the tree on paper, line by line. That's a **level-order traversal**

---

The nodes of a tree sit on **levels**. The root is on level **0**, its children on level **1**, their children on level **2**, and so on

```text
        8            level 0
       / \
      3   10         level 1
     / \    \
    1   6    14      level 2
```

A level-order traversal visits them top to bottom and, on each level, left to right

```text
8 3 10 1 6 14
```

The number of the last level is the tree's height: here **2**, the same answer the recursive **height** gave last lesson

---

Recursion doesn't fit this walk. A recursive call on the left child finishes the whole left side before the right child gets its turn, so **1** and **6** would come out before **10**. Something else has to remember which nodes are waiting, and hand them out in the order they were found

That's a **queue**, like the line at a till. Whoever joins goes to the back, whoever is served comes from the front: first in, first out

```text
join:   Ana, then Ben, then Cris

front [ Ana  Ben  Cris ] back

serve:  Ana comes out first, then Ben
```

---

Python has a queue ready-made, **deque**, in the **collections** module. **append** adds to the back, and **popleft** takes from the front

```py
from collections import deque

queue = deque()
queue.append("Ana")
queue.append("Ben")
queue.append("Cris")

print(queue.popleft())
print(queue.popleft())
print(len(queue))
```

Output

```text
Ana
Ben
1
```

A plain list could do it too, with **pop(0)**, but it moves every item left by one each time it takes the first. **popleft** doesn't move anything, however long the queue gets

---

Now the walk itself. Put the root in the queue. Then, as long as the queue isn't empty: take the node at the front, print it, and put its children at the back

```py
from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def level_order(root):
    queue = deque()
    queue.append(root)
    while len(queue) > 0:
        node = queue.popleft()
        print(node.value, end=" ")
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
    print()


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

level_order(root)
```

Output **8 3 10 1 6 14**

Here is the queue after each node is taken out and its children put in. The children always join behind everything already waiting, so a whole level leaves the queue before the next one starts

```visual
{"use": "level-order-queue"}
```

The two **if** lines keep missing children out of the queue: there's no node to take out later when the child is **None**

---

To print each level on its own line, notice what the queue holds when a level begins: exactly the nodes of that level, and nothing else

```text
level 0 begins    [8]
level 1 begins    [3, 10]
level 2 begins    [1, 6, 14]
```

So count them first with **len(queue)**, and take out exactly that many. The children they put in wait for the next round

```py
from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def print_levels(root):
    queue = deque()
    queue.append(root)
    level = 0
    while len(queue) > 0:
        size = len(queue)
        print(f"Level {level}:", end=" ")
        for i in range(size):
            node = queue.popleft()
            print(node.value, end=" ")
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        print()
        level += 1


root = Node(8)
root.left = Node(3)
root.right = Node(10)
root.left.left = Node(1)
root.left.right = Node(6)
root.right.right = Node(14)

print_levels(root)
```

Output

```text
Level 0: 8
Level 1: 3 10
Level 2: 1 6 14
```

---

Going level by level, the walk reaches every node close to the root before any node further away. That's why this walk, called **breadth-first** in general, comes back in the graph lessons: it finds the shortest way from one place to another

---

## Mission: Read a Tree by Levels

Here is a binary tree with seven nodes, with a letter where each value goes

```text
        a
       / \
      b   c
     /   / \
    d   e   f
         \
          g
```

1. Write the class **Node**, with a value, a left child and a right child
2. Start your program with the seven values, one variable per letter, from `a` to `g`
3. Build the tree: a node for each value, linked as in the picture
4. Walk it level by level with a queue, and print one line per level: **Level**, the level's number, a colon, and the values on that level from left to right

The values are whole numbers from -1000 to 1000, and two of them can be equal

**Example** for a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 and g = 7

```text
Level 0: 1
Level 1: 2 3
Level 2: 4 5 6
Level 3: 7
```

**Example** for a = 40, b = 20, c = 60, d = 10, e = 50, f = 70 and g = 55

```text
Level 0: 40
Level 1: 20 60
Level 2: 10 50 70
Level 3: 55
```
