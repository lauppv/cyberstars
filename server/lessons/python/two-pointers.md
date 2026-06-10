The **two pointers** technique is a simple but powerful idea: instead of using one variable to scan through data, we use **two** — one starting from the beginning and one from the end (or one slow and one fast)

We've already seen it without knowing it. When we checked palindromes, we compared the first character with the last, then the second with the second-to-last. That was two pointers

```py
def is_palindrome(word):
    left = 0
    right = len(word) - 1

    while left < right:
        if word[left] != word[right]:
            return False
        left += 1
        right -= 1

    return True

print(is_palindrome("racecar"))
print(is_palindrome("hello"))
```

Output

```text
True
False
```

**left** starts at 0, **right** starts at the last index. We compare, then move them towards each other. When they meet in the middle, we're done

---

Another classic: given a **sorted** list and a target sum, find two numbers that add up to the target

The brute force way (nested loop, checking every pair) works but is slow. With two pointers on a **sorted** list, it's much smarter

```py
def two_sum(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return (numbers[left], numbers[right])
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return None

numbers = [1, 2, 4, 7, 11, 15]
result = two_sum(numbers, 9)
print(result)
```

Output **(2, 7)**

How does it work? We add the smallest (left) and largest (right) numbers. If the sum is **too small**, we need a bigger number → move **left** to the right. If the sum is **too big**, we need a smaller number → move **right** to the left. If it's **just right**, we found our pair

This works because the list is **sorted**. Moving left increases the sum, moving right decreases it. We narrow down from both sides until we find the answer (or the pointers meet, meaning no pair exists)

---

A simpler example: **remove duplicates** from a sorted list (keeping only unique elements)

```py
def remove_duplicates(numbers):
    if len(numbers) == 0:
        return []

    result = [numbers[0]]
    for i in range(1, len(numbers)):
        if numbers[i] != numbers[i - 1]:
            result.append(numbers[i])
    return result

print(remove_duplicates([1, 1, 2, 2, 2, 3, 4, 4, 5]))
```

Output **[1, 2, 3, 4, 5]**

Here we compare each element with the **previous** one. If they're different, it's a new unique value — keep it

---

## Mission: Docking Pairs

Ships waiting to dock each carry a fuel load (already on the right, sorted from lowest to highest). Two ships may share a docking clamp only if their fuel loads add up to exactly the target. Find every valid pair.

Write a function **pair_with_sum(numbers, target)** that takes a **sorted** list and a target number, and returns a list of **all** pairs that add up to the target. Use the **two pointers** technique (one pointer at the start, one at the end, move them towards each other).

Then print `Pairs: ` followed by the list of pairs, and `Total pairs: ` followed by how many there are.

```py
fuels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Output**

```text
Pairs: [(1, 9), (2, 8), (3, 7), (4, 6)]
Total pairs: 4
```
