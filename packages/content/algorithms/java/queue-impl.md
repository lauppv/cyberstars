Implement a **Queue** class using an `ArrayList` as the internal storage. The queue should support `enqueue`, `dequeue`, and `peek` operations following the FIFO (First In, First Out) principle.

Process commands from stdin and print results for `dequeue` and `peek`. If `dequeue` or `peek` is called on an empty queue, print `Empty`.

### Input

- Line 1: number of commands N (1 <= N <= 2·10^4)
- For each command:
  - Line 1: command type (`enqueue`, `dequeue`, or `peek`)
  - Only for `enqueue`, line 2: the integer X (any `int` value)

Behavior:

- `enqueue X`: add X to the back of the queue
- `dequeue`: remove and print the front element
- `peek`: print the front element without removing it

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

```visual
{
  "type": "stack",
  "queue": true,
  "ends": true,
  "caption": "A queue: values leave in the order they came, like people in a line. They join at the back, and dequeue and peek work on the front.",
  "steps": [
    {"push": [{"id": "v1", "text": 10}], "focus": ["v1"], "caption": "enqueue 10: 10 joins the empty queue"},
    {"push": [{"id": "v2", "text": 20}], "focus": ["v2"], "caption": "enqueue 20: 20 joins at the back, behind 10"},
    {"ask": "What does peek print?", "focus": ["v1"], "caption": "10: peek shows the front and leaves it there"},
    {"ask": "What does dequeue print?", "pop": 1, "focus": ["v1"], "caption": "10: dequeue takes the front out. 20 is at the front now"},
    {"ask": "What does dequeue print?", "pop": 1, "focus": ["v2"], "caption": "20: dequeue takes the front out. The queue is empty now"},
    {"ask": "What does dequeue print?", "caption": "Empty: the queue is empty, so there is nothing to take out"}
  ]
}
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
