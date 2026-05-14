We know that **sorted()** sorts a list for us. But how does sorting actually **work**? What does the computer do behind the scenes? Understanding sorting algorithms teaches us how to think about **efficiency** and **logic**

The simplest sorting algorithm is **Bubble Sort**. Here's the idea: go through the list and compare **neighboring** elements. If the left one is bigger than the right one, **swap** them. Keep doing this until the list is sorted

```py
numbers = [5, 3, 8, 1, 2]
```

**Pass 1**: compare neighbors, swap if needed
- Compare 5 and 3 → 5 > 3, swap → **[3, 5, 8, 1, 2]**
- Compare 5 and 8 → 5 < 8, ok → **[3, 5, 8, 1, 2]**
- Compare 8 and 1 → 8 > 1, swap → **[3, 5, 1, 8, 2]**
- Compare 8 and 2 → 8 > 2, swap → **[3, 5, 1, 2, 8]**

After pass 1, the **biggest number (8)** has "bubbled up" to the end. That's why it's called **Bubble Sort**

**Pass 2**:
- 3 and 5 → ok
- 5 and 1 → swap → **[3, 1, 5, 2, 8]**
- 5 and 2 → swap → **[3, 1, 2, 5, 8]**

**Pass 3**:
- 3 and 1 → swap → **[1, 3, 2, 5, 8]**
- 3 and 2 → swap → **[1, 2, 3, 5, 8]**

**Done!** The list is sorted

---

In code
```py
numbers = [5, 3, 8, 1, 2]

for i in range(len(numbers)):
    for j in range(len(numbers) - 1):
        if numbers[j] > numbers[j + 1]:
            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]

print(numbers)
```
Output **[1, 2, 3, 5, 8]**

The trick **numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]** is Python's way of **swapping** two variables. In other languages you'd need a temporary variable, but Python makes it easy

---

Let's trace through to make sure we understand the two loops

The **outer loop** (i) controls how many passes we make. We need at most **n** passes where n is the length of the list

The **inner loop** (j) goes through the list and compares neighbors. **j** goes up to **len(numbers) - 1** because we compare **j** with **j + 1**, and we don't want to go out of bounds

---

**Is Bubble Sort fast?** Honestly, no. For a list of **n** elements, it does roughly **n × n** comparisons. For 10 elements, that's about 100 comparisons — fine. For 1,000,000 elements, that's about 1,000,000,000,000 comparisons — very slow

That's why in real code we use **sorted()**, which uses a much faster algorithm. But understanding Bubble Sort teaches us how to think about **comparisons** and **swaps**, which is the foundation of many algorithms

---

Write a function **bubbleSort** that takes a list and sorts it using bubble sort. Return the sorted list

```py
print(bubbleSort([5, 3, 8, 1, 2]))    # [1, 2, 3, 5, 8]
print(bubbleSort([10, 7, 3, 9, 1]))   # [1, 3, 7, 9, 10]
```

Expected output
```text
[1, 2, 3, 5, 8]
[1, 3, 7, 9, 10]
```