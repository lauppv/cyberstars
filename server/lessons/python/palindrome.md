A **palindrome** is a word that reads the same forwards and backwards. **racecar**, **madam**, **level** — flip them around and they're the same

How do we check if a word is a palindrome? The simplest approach: **reverse it and compare**

```py
word = "racecar"
if word == word[::-1]:
    print("Palindrome!")
else:
    print("Not a palindrome")
```

Output **Palindrome!**

That's it. One line of logic. We reverse the string and check if it's the same as the original. Python makes this absurdly simple

---

But let's also think about how to do this **without** the slicing trick, because the logic is important

A palindrome means: the **first** character equals the **last**, the **second** equals the **second-to-last**, and so on

```py
def is_palindrome(word):
    for i in range(len(word) // 2):
        if word[i] != word[len(word) - 1 - i]:
            return False
    return True

print(is_palindrome("racecar"))
print(is_palindrome("hello"))
print(is_palindrome("madam"))
```

Output

```text
True
False
True
```

We only need to check **half** the string. Why? Because if the first half matches the second half (mirrored), we're done. Checking the other half would be redundant

**len(word) // 2** gives us half the length (integer division). For "racecar" (7 letters), we check positions 0, 1, 2 (comparing with 6, 5, 4)

---

What about sentences? "A man a plan a canal Panama" is a palindrome if we ignore spaces and capitalization

```py
def is_palindrome_sentence(text):
    cleaned = ""
    for char in text:
        if char.isalpha():
            cleaned += char.lower()
    return cleaned == cleaned[::-1]

print(is_palindrome_sentence("A man a plan a canal Panama"))
print(is_palindrome_sentence("racecar"))
print(is_palindrome_sentence("hello world"))
```

Output

```text
True
True
False
```

We first **clean** the string: keep only letters and convert to lowercase. Then check if it's a palindrome. Step by step, just like we learned in the decomposition lesson

---

## Mission: Signal Integrity Check

A signal code is only trustworthy if it reads the same forwards and backwards — a **palindrome**. The station logged a batch of codes and needs them checked.

1. Write a function **is_palindrome(word)** that returns `True` if the word is a palindrome, `False` otherwise. Use a **loop** (compare the first letter with the last, the second with the second-to-last, ...), not `[::-1]`.
2. For each code, print the code, then `: `, then the result.
3. Count how many codes are palindromes and print `Valid signals: ` followed by that count.

**Output**

```text
racecar: True
signal: False
level: True
orbit: False
radar: True
Valid signals: 3
```
