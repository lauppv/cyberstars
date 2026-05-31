The **counter** pattern counts **how many** things match a condition. The **accumulator** pattern is its cousin: instead of counting, we **build up** a result. It could be a sum, a product, a string, or a list

We already saw the simplest accumulator when we summed prices

```py
prices = [10, 20, 30, 40]
total = 0
for price in prices:
    total += price
print(total)
```

Output **100**. We **accumulated** the sum step by step

---

But accumulators aren't just for numbers. We can build **strings**

```py
words = ["Vice", "City", "Stories"]
sentence = ""
for word in words:
    sentence += word + " "
print(sentence)
```

Output **Vice City Stories**

Or build a **new list** from an existing one

```py
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = []
for n in numbers:
    if n % 2 == 0:
        evens.append(n)
print(evens)
```

Output **[2, 4, 6, 8, 10]**

The pattern is always:

1. **Initialize** the accumulator (0 for sum, "" for string, [] for list)
2. **Loop** through the data
3. **Add** to the accumulator in each iteration (or some iterations)

---

A fun example: let's build a **reversed** string

```py
original = "Tommy"
reversed_str = ""
for char in original:
    reversed_str = char + reversed_str
print(reversed_str)
```

Output **ymmoT**

How does this work? Each new character goes at the **beginning** instead of the end. First iteration: **"T"**. Second: **"oT"**. Third: **"moT"**. And so on. Think about it, it's a beautiful trick

---

Another example: **product** of all numbers in a list

```py
numbers = [2, 3, 4, 5]
product = 1
for n in numbers:
    product *= n
print(product)
```

Output **120** (2 × 3 × 4 × 5). Notice that we start with **1** not **0**. Why? Because multiplying by 0 would give us 0 forever. The starting value depends on the operation: **0** for sum, **1** for product, **""** for strings, **[]** for lists

---

## Mission: Signal Accumulator

You have a list of signal `strengths` and a `code` word (both on the right). Using the **accumulator pattern** for each step:

1. `Sum: ` then the total of all strengths (accumulate from `0`)
2. `Strong: ` then a **list** of only the strengths **above 50** (accumulate into an empty `[]`)
3. `Reversed: ` then the code word reversed **character by character** (accumulate into an empty `""`, putting each new character at the **front**)

**Output**

```text
Sum: 255
Strong: [65, 90]
Reversed: TIBRO
```
