Combines **while loops**, **functions**, **input** and **operators**

---

## Mission: The Data Center Compute Queue

The compute center receives a queue of commands from connected teletypes. Each line in the queue holds two operands and an operation code. The compute farm must process the queue until it receives the stop signal (op code 0).

Write these functions:

- **int add(int a, int b)** — returns a + b
- **int multiply(int a, int b)** — returns a \* b
- **int power(int base, int exp)** — returns base^exp using a **while loop**

The main program reads three integers from input: **a**, **b** and **op**

- If **op** is **1**, print the result of **add(a, b)**
- If **op** is **2**, print the result of **multiply(a, b)**
- If **op** is **3**, print the result of **power(a, b)**
- If **op** is **0**, stop the program

**Example**

Input

```text
3 4 1
2 5 2
2 8 3
0 0 0
```

Output

```text
7
10
256
```

**Example**

Input

```text
10 20 1
0 0 0
```

Output

```text
30
```

Each input line has three numbers. Process them one at a time until op is 0. Implement **power** with a while loop, not a library function.
