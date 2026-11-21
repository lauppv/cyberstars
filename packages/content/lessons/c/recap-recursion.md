Put recursion and static variables to work together

---

## Mission: The Call Counter

Somebody left a job on the mainframe that computes Fibonacci numbers. It's very slow, and the shift chief wants to know why. Your job is to count how many times the recursive function gets called

The Fibonacci numbers start with 0 and 1, and each next one is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13...

1. Write a function **int counter(int step)** that keeps a running total in a static variable. It adds step to the total and returns the new total. So counter(1) counts one more, and counter(0) only tells you the total so far
2. Write a recursive function **int fib(int n)**: fib(0) is 0, fib(1) is 1, and fib(n) is fib(n - 1) + fib(n - 2). Every time fib starts, it calls counter(1)
3. Read a whole number k from input, then k values of n. For each n, print its Fibonacci number and how many calls to fib it took, as in the example
4. The counter never goes back to 0, so for each n, look at the total before and after

Every n is from 0 to 25, and k is from 1 to 10

**Example**

Input

```text
3
10 0 2
```

Output

```text
fib(10) = 55, calls: 177
fib(0) = 0, calls: 1
fib(2) = 1, calls: 3
```

Look how fast the calls grow. fib(10) asks for fib(9) and fib(8), but fib(9) asks for fib(8) again, and every value gets worked out many times over
