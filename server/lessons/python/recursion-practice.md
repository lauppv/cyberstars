Let's practice recursion with more examples. The key to getting comfortable with recursion is to always ask yourself two questions: **what's the base case?** and **how does the problem get smaller?**

---

**Fibonacci sequence**: each number is the sum of the two before it. 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

The rule: **fib(n) = fib(n-1) + fib(n-2)**. Base cases: **fib(0) = 0** and **fib(1) = 1**

```py
def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fib(n - 1) + fib(n - 2)

for i in range(10):
    print(fib(i), end=" ")
```

Output **0 1 1 2 3 5 8 13 21 34**

Beautiful? Yes. Efficient? Not really. **fib(5)** calls **fib(4)** and **fib(3)**. But **fib(4)** also calls **fib(3)** — so we compute the same thing twice. For **fib(30)**, this repeats millions of times. For now, don't worry about it — understanding the logic is what matters

---

**Reverse a string** recursively

```py
def reverseStr(s):
    if len(s) <= 1:
        return s
    return reverseStr(s[1:]) + s[0]

print(reverseStr("Tommy"))
```

Output **ymmoT**

The idea: the reverse of "Tommy" is the reverse of "ommy" followed by "T". The reverse of "ommy" is the reverse of "mmy" followed by "o". And so on until we have a single character (base case)

---

**Count occurrences** of a character in a string

```py
def countChar(text, target):
    if len(text) == 0:
        return 0
    first = 1 if text[0] == target else 0
    return first + countChar(text[1:], target)

print(countChar("banana", "a"))
print(countChar("mississippi", "s"))
```

Output

```text
3
4
```

Check the first character. If it matches, count 1. Then recursively count in the rest of the string. Base case: empty string → 0

---

**Flatten a nested list**. This is where recursion truly shines — when data is **nested** and we don't know how deep

```py
def flatten(lst):
    result = []
    for item in lst:
        if type(item) == list:
            result = result + flatten(item)
        else:
            result.append(item)
    return result

print(flatten([1, [2, 3], [4, [5, 6]], 7]))
```

Output **[1, 2, 3, 4, 5, 6, 7]**

For each element: if it's a list, recursively flatten it and add the results. If it's not a list, just add it. A loop alone can't handle arbitrary nesting depth — recursion can

---

## Mission: Transmission Checksums

Every transmission carries a numeric code, and the station verifies it with a **checksum** — the sum of the code's digits. You'll compute these checksums with **recursion**.

1. Write a recursive function **sum_digits(n)** that returns the sum of the digits of a positive integer. The trick: `n % 10` is the **last digit**, `n // 10` is the **rest of the number**. Base case: if `n < 10` (one digit), return `n` itself.
2. For each code in the list, print the code, then `: `, then its checksum.
3. Track and print the **largest** checksum as `Largest checksum: ` followed by the value.

**Output**

```text
1234: 10
999: 27
5: 5
4070: 11
88: 16
Largest checksum: 27
```
