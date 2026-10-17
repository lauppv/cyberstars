A school has `n` courses, numbered from `0` to `n - 1`, and some rules: a rule `u v` says that course `u` has to be taken before course `v`. Print an order that takes every course once and keeps every rule. When several courses could come next, always take the one with the smallest number, so only one order is right. If the rules go round in a circle, no order works: print `-1`.

### How the rules are written

The first line has the number of courses `n` and the number of rules `m`. Then come `m` lines, one rule `u v` each. This is a directed graph: each rule is an edge from `u` to `v`, and it works only that way.

```
3 --> 1 --> 0
2 --> 4 --> 0
```

These are the rules of the first example below: `3` comes before `1`, `1` before `0`, `2` before `4` and `4` before `0`.

The starter code already reads the rules into the global arrays `adj` and `count`, where `adj[u][0]` to `adj[u][count[u] - 1]` are the courses that need `u` first, then prints the courses `course_order` writes into `order`, or `-1` when it returns 0. You write `course_order`, which fills `order` and returns how many courses it wrote, or 0 when there is no order.

### Input

- Line 1: `n` and `m`. There are between 1 and 500 courses and at most 2000 rules.
- The next `m` lines: the rules. No rule puts a course before itself, and no rule is written twice.

### Output

The courses in order, separated by single spaces, or `-1`.

### Examples

```
Input:
5 4
3 1
1 0
2 4
4 0

Output:
2 3 1 4 0
```

At the start `2` and `3` are free, and `2` is smaller. Once `2` and `3` are done, `1` and `4` are both free, so `1` comes first. `0` waits for both.

```
Input:
3 3
0 1
1 2
2 0

Output:
-1
```

Each course waits for another one, round in a circle.

```
Input:
3 0

Output:
0 1 2
```
