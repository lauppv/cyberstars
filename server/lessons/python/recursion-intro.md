**Recursion** is when a function **calls itself**. Yes, you read that right. A function can call itself. It sounds like it should break everything, but when done correctly, it's one of the most elegant tools in programming

Let's start with a real-life analogy. Imagine you're in a line of people and you want to know how many people are in front of you. You can't see the front, so you ask the person in front of you: "how many people are in front of **you**?" They don't know either, so they ask the person in front of **them**. This continues until someone at the very front says "**zero** — there's nobody in front of me". Then the answer comes back: 0, 1, 2, 3, ...

That's recursion. **Each person asks the same question to the next**, until someone knows the answer directly

---

In code, the simplest example: **counting down**

```py
def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)

countdown(5)
```

Output

```text
5
4
3
2
1
Go!
```

**countdown(5)** prints 5, then calls **countdown(4)**. Which prints 4, then calls **countdown(3)**. And so on. When **n == 0**, we print "Go!" and **stop** (return). Without that stop condition, the function would call itself forever — an **infinite recursion**, just like an infinite loop

The stop condition is called the **base case**. Every recursive function needs one

---

A classic: **factorial**. 5! = 5 × 4 × 3 × 2 × 1 = 120

Think about it recursively: **5! = 5 × 4!**. And **4! = 4 × 3!**. And so on. Until **1! = 1** (base case)

```py
def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
print(factorial(3))
```

Output

```text
120
6
```

Let's trace **factorial(5)**:

- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = 1 ← base case!
- Now it unwinds: 2×1=2, 3×2=6, 4×6=24, 5×24=120

---

Another classic: **sum of a list**

```py
def sumList(numbers):
    if len(numbers) == 0:
        return 0
    return numbers[0] + sumList(numbers[1:])

print(sumList([1, 2, 3, 4, 5]))
```

Output **15**

The idea: the sum of a list is the **first element** plus the **sum of the rest**. The rest gets smaller and smaller until it's empty (base case: return 0)

---

**When to use recursion?** Recursion shines when a problem can naturally be broken into **smaller versions of itself**. Trees, nested structures, mathematical sequences, divide-and-conquer algorithms — these all love recursion

For simple things like counting or summing, a **loop** is usually clearer and more efficient. But understanding recursion opens the door to solving problems that loops can't handle elegantly

---

## Mission: Signal Amplifier

The station's signal amplifier doubles its strength at each stage. To predict the output, you need to compute powers of 2 — and you'll do it with **recursion**.

1. Write a recursive function **power(base, exp)** that returns `base` raised to the power `exp`. The rule: `base^exp = base * base^(exp - 1)`. Base case: `base^0 = 1` (no loops, no `**`).
2. With `base = 2`, use a **for loop** over `range(5)` to print the amplifier table: for each `exp` from 0 to 4, print the line `2^exp = result` (using the actual numbers).

**Output**

```text
2^0 = 1
2^1 = 2
2^2 = 4
2^3 = 8
2^4 = 16
```
