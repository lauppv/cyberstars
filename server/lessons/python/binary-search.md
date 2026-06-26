Remember **linear search**? We go through the list one element at a time. For a list of **1,000,000** elements, we might check all of them. That's slow

**Binary search** is dramatically faster, but it has one requirement: the list must be **sorted**

The idea: look at the **middle** element. If it's what we're looking for, great. If our target is **smaller**, it must be in the **left half**. If it's **bigger**, it must be in the **right half**. Then repeat on the correct half

Think of a phone book. You're looking for "Vercetti". You don't start from page 1. You open the book roughly in the middle. If the middle page shows names starting with "M", you know Vercetti is in the **second half**. You open the middle of the second half. And so on

```py
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 13
```

**Step 1**: middle index = 4, middle value = 9. Is 13 > 9? Yes → search the right half

**Step 2**: right half is [11, 13, 15, 17, 19]. Middle = 15. Is 13 < 15? Yes → search the left part

**Step 3**: left part is [11, 13]. Middle = 11. Is 13 > 11? Yes → search right

**Step 4**: [13]. Found it!

We checked **4 elements** instead of scanning all 10. For 1,000,000 elements, binary search checks at most **20** — that's the magic of cutting the problem in half each time

---

In code

```py
def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        mid = (left + right) // 2

        if numbers[mid] == target:
            return mid
        elif numbers[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(numbers, 13))
print(binary_search(numbers, 6))
```

Output

```text
6
-1
```

13 is at index 6. 6 is not in the list, so we return -1

---

Let's trace through **binary_search([1,3,5,7,9,11,13,15,17,19], 13)**

- left=0, right=9, mid=4 → numbers[4]=9 < 13 → left=5
- left=5, right=9, mid=7 → numbers[7]=15 > 13 → right=6
- left=5, right=6, mid=5 → numbers[5]=11 < 13 → left=6
- left=6, right=6, mid=6 → numbers[6]=13 == 13 → **found at index 6!**

---

We can also write it **recursively**

```py
def binary_search_recursive(numbers, target, left, right):
    if left > right:
        return -1

    mid = (left + right) // 2

    if numbers[mid] == target:
        return mid
    elif numbers[mid] < target:
        return binary_search_recursive(numbers, target, mid + 1, right)
    else:
        return binary_search_recursive(numbers, target, left, mid - 1)

numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search_recursive(numbers, 13, 0, len(numbers) - 1))
```

Output **6**. Same logic, different style

---

**How fast is binary search?** Every step cuts the list in half. Starting from **n** elements: n → n/2 → n/4 → n/8 → … → 1. How many halvings? That's **log₂(n)**. For 1,000,000 elements: log₂(1,000,000) ≈ **20 steps**. Compare that with linear search's 1,000,000 steps. The difference is massive

---

## Mission: Archive Lookup

The station archive stores crew IDs in a **sorted** list. Mission Control fires off a batch of lookup queries and needs each one answered fast — so you'll use **binary search**, not a linear scan.

1. Write a function **binary_search(numbers, target)** that returns the **index** where `target` sits in the sorted list, or `-1` if it isn't there.
2. For each query, print the query, then `-> index ` and the index if it was found, or `-> not found` if it wasn't.
3. Print `Found: ` followed by how many queries were located.

```py
ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
queries = [23, 50, 8, 91, 100]
```

**Output**

```text
23 -> index 5
50 -> not found
8 -> index 2
91 -> index 9
100 -> not found
Found: 3
```
