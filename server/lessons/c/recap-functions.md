Combine **while loops**, **functions**, **input**, and **operators**

---

Build a **mini calculator** that reads operations from input until the user types **0**

Write these functions:

- **int add(int a, int b)** — returns a + b
- **int multiply(int a, int b)** — returns a \* b
- **int power(int base, int exp)** — returns base^exp using a **while loop**

The main program reads three integers from input: **a**, **b**, and **op**

- If **op** is **1**, print the result of **add(a, b)**
- If **op** is **2**, print the result of **multiply(a, b)**
- If **op** is **3**, print the result of **power(a, b)**
- If **op** is **0**, stop the program

The input will be

```text
3 4 1
2 5 2
2 8 3
0 0 0
```

Expected output

```text
7
10
256
```

Each line of input has three numbers. Process them one by one until op is 0. Remember: **power(2, 8)** means 2 _ 2 _ 2 _ 2 _ 2 _ 2 _ 2 \* 2 = 256. Implement it with a while loop, **not** with a library function
