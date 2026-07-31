Implement a **Queue** class using an `ArrayList` as the internal storage. The queue should support `enqueue`, `dequeue`, and `peek` operations following the FIFO (First In, First Out) principle.

Process commands from stdin and print results for `dequeue` and `peek`. If `dequeue` or `peek` is called on an empty queue, print `Empty`.

### Input

- Line 1: number of commands N
- For each command:
  - Line 1: command type (`enqueue`, `dequeue`, or `peek`)
  - Only for `enqueue`, line 2: the integer X

Behavior:

- `enqueue X` — add X to the back of the queue
- `dequeue` — remove and print the front element
- `peek` — print the front element without removing it

### Output

- For each `dequeue`: the removed value, or `Empty`
- For each `peek`: the front value, or `Empty`

### Examples

```
Input:
6
enqueue
10
enqueue
20
peek
dequeue
dequeue
dequeue

Output:
10
10
20
Empty
```

```
Input:
4
enqueue
5
enqueue
15
dequeue
peek

Output:
5
15
```

```
Input:
2
dequeue
peek

Output:
Empty
Empty
```

Both `dequeue` and `peek` must print `Empty` when the queue has nothing in it.
