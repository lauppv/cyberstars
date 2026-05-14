Bubble Sort works, but it's a bit wasteful — it makes a lot of unnecessary swaps. **Selection Sort** takes a different approach: find the **smallest** element and put it in position 0, then find the **second smallest** and put it in position 1, and so on

Think of it like organizing a deck of cards. You look through all the cards, find the smallest, and put it first. Then look through the remaining cards, find the smallest of those, and put it second. Repeat until everything is in order

```py
numbers = [5, 3, 8, 1, 2]
```

**Step 1**: find the smallest in the whole list → **1** (at index 3). Swap it with position 0
→ **[1, 3, 8, 5, 2]**

**Step 2**: find the smallest from index 1 onward → **2** (at index 4). Swap with position 1
→ **[1, 2, 8, 5, 3]**

**Step 3**: find the smallest from index 2 onward → **3** (at index 4). Swap with position 2
→ **[1, 2, 3, 5, 8]**

**Step 4**: find the smallest from index 3 onward → **5** (at index 3). Already in place
→ **[1, 2, 3, 5, 8]**

**Done!**

---

In code
```py
numbers = [5, 3, 8, 1, 2]

for i in range(len(numbers)):
    minIndex = i
    for j in range(i + 1, len(numbers)):
        if numbers[j] < numbers[minIndex]:
            minIndex = j
    numbers[i], numbers[minIndex] = numbers[minIndex], numbers[i]

print(numbers)
```
Output **[1, 2, 3, 5, 8]**

The **outer loop** picks each position (0, 1, 2, ...). For each position, the **inner loop** scans the rest of the list to find the smallest element. Then we **swap** it into place

The key difference from Bubble Sort: we only do **one swap per pass** instead of potentially many. We find the minimum first, then swap once

---

Let's trace through the code for **[5, 3, 8, 1, 2]**

**i = 0**: minIndex starts at 0 (value 5). Inner loop finds 1 at index 3, so minIndex = 3. Swap positions 0 and 3 → **[1, 3, 8, 5, 2]**

**i = 1**: minIndex starts at 1 (value 3). Inner loop finds 2 at index 4, so minIndex = 4. Swap positions 1 and 4 → **[1, 2, 8, 5, 3]**

**i = 2**: minIndex starts at 2 (value 8). Inner loop finds 3 at index 4, so minIndex = 4. Swap positions 2 and 4 → **[1, 2, 3, 5, 8]**

**i = 3**: minIndex starts at 3 (value 5). Inner loop finds nothing smaller, minIndex stays 3. Swap with itself → **[1, 2, 3, 5, 8]**

---

**Is Selection Sort faster than Bubble Sort?** They do roughly the same number of **comparisons** (n × n). But Selection Sort does fewer **swaps**, which can matter in practice. Still, both are slow for large lists. The real-world **sorted()** is hundreds of times faster

The point of learning these algorithms is not to use them in production. It's to understand **how to think** about breaking a problem into steps, tracking state with variables, and using nested loops effectively

---

Write a function **selectionSort** that takes a list and sorts it using selection sort. Return the sorted list

```py
print(selectionSort([64, 25, 12, 22, 11]))   # [11, 12, 22, 25, 64]
print(selectionSort([5, 1, 4, 2, 8]))         # [1, 2, 4, 5, 8]
```

Expected output
```text
[11, 12, 22, 25, 64]
[1, 2, 4, 5, 8]
```