Bubble Sort works, but it's a bit wasteful: it makes a lot of unnecessary swaps. **Selection Sort** takes a different approach: find the **smallest** element and put it in position 0, then find the **second smallest** and put it in position 1, and so on

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
    min_index = i
    for j in range(i + 1, len(numbers)):
        if numbers[j] < numbers[min_index]:
            min_index = j
    numbers[i], numbers[min_index] = numbers[min_index], numbers[i]

print(numbers)
```

Output **[1, 2, 3, 5, 8]**

The **outer loop** picks each position (0, 1, 2, ...). For each position, the **inner loop** scans the rest of the list to find the smallest element. Then we **swap** it into place

The key difference from Bubble Sort: we only do **one swap per pass** instead of potentially many. We find the minimum first, then swap once

---

Let's trace through the code for **[5, 3, 8, 1, 2]**

**i = 0**: min_index starts at 0 (value 5). Inner loop finds 1 at index 3, so min_index = 3. Swap positions 0 and 3 → **[1, 3, 8, 5, 2]**

**i = 1**: min_index starts at 1 (value 3). Inner loop finds 2 at index 4, so min_index = 4. Swap positions 1 and 4 → **[1, 2, 8, 5, 3]**

**i = 2**: min_index starts at 2 (value 8). Inner loop finds 3 at index 4, so min_index = 4. Swap positions 2 and 4 → **[1, 2, 3, 5, 8]**

**i = 3**: min_index starts at 3 (value 5). Inner loop finds nothing smaller, min_index stays 3. Swap with itself → **[1, 2, 3, 5, 8]**

```visual
{
  "type": "array",
  "values": [5, 3, 8, 1, 2],
  "caption": "i marks the position to fill. j walks the rest of the list, and min_index remembers where the smallest number seen so far is. When j is done, that number swaps into position i.",
  "markers": ["i = {i}", "j = {i}", "min_index = {i}"],
  "steps": [
    {"title": "Step 1", "at": [0, 1, 0], "compare": [1, 0], "ask": "Is 3 < 5?", "caption": "Yes, so min_index = 1", "move": [0, 1, 1]},
    {"at": [0, 2, 1], "compare": [2, 1], "ask": "Is 8 < 3?", "caption": "No, min_index stays 1"},
    {"at": [0, 3, 1], "compare": [3, 1], "ask": "Is 1 < 3?", "caption": "Yes, so min_index = 3", "move": [0, 3, 3]},
    {"at": [0, 4, 3], "compare": [4, 3], "ask": "Is 2 < 1?", "caption": "No, min_index stays 3"},
    {"at": [0, null, 3], "compare": [0, 3], "swap": true, "done": [0], "caption": "The smallest is 1, at index 3. It swaps into position 0 → [1, 3, 8, 5, 2]"},
    {"title": "Step 2", "at": [1, 2, 1], "compare": [2, 1], "ask": "Is 8 < 3?", "caption": "No, min_index stays 1"},
    {"at": [1, 3, 1], "compare": [3, 1], "ask": "Is 5 < 3?", "caption": "No, min_index stays 1"},
    {"at": [1, 4, 1], "compare": [4, 1], "ask": "Is 2 < 3?", "caption": "Yes, so min_index = 4", "move": [1, 4, 4]},
    {"at": [1, null, 4], "compare": [1, 4], "swap": true, "done": [0, 1], "caption": "The smallest from index 1 on is 2, at index 4. It swaps into position 1 → [1, 2, 8, 5, 3]"},
    {"title": "Step 3", "at": [2, 3, 2], "compare": [3, 2], "ask": "Is 5 < 8?", "caption": "Yes, so min_index = 3", "move": [2, 3, 3]},
    {"at": [2, 4, 3], "compare": [4, 3], "ask": "Is 3 < 5?", "caption": "Yes, so min_index = 4", "move": [2, 4, 4]},
    {"at": [2, null, 4], "compare": [2, 4], "swap": true, "done": [0, 1, 2], "caption": "The smallest from index 2 on is 3, at index 4. It swaps into position 2 → [1, 2, 3, 5, 8]"},
    {"title": "Step 4", "at": [3, 4, 3], "compare": [4, 3], "ask": "Is 8 < 5?", "caption": "No, min_index stays 3"},
    {"at": [3, null, 3], "done": [0, 1, 2, 3, 4], "caption": "5 is already in position 3, so it swaps with itself and nothing moves. The last number, 8, is in place too. Done!"}
  ]
}
```

---

**Is Selection Sort faster than Bubble Sort?** They do roughly the same number of **comparisons** (n × n). But Selection Sort does fewer **swaps**, which can matter in practice. Still, both are slow for large lists. The real-world **sorted()** is hundreds of times faster

The point of learning these algorithms is not to use them in production. It's to understand **how to think** about breaking a problem into steps, tracking state with variables, and using nested loops effectively

---

## Mission: Cargo Sort

The cargo bay scanner reports container weights in whatever order they were loaded. To balance the hold, the crew needs them sorted from lightest to heaviest.

Write a function **selection_sort(numbers)** that sorts a list in **ascending** order using selection sort and **returns** the sorted list.

Then sort the two batches of weights (`batch1` and `batch2`, already in the starter) and print each result.

```py
batch1 = [64, 25, 12, 22, 11]
batch2 = [9, 7, 5, 3, 1]
print(selection_sort(batch1))
print(selection_sort(batch2))
```

**Output**

```text
[11, 12, 22, 25, 64]
[1, 3, 5, 7, 9]
```
