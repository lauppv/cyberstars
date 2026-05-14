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

That's it. One line of logic. We reverse the string and check if it's the same as the original. Python makes this absurdly simple :)

---

But let's also think about how to do this **without** the slicing trick, because the logic is important

A palindrome means: the **first** character equals the **last**, the **second** equals the **second-to-last**, and so on

```py
def isPalindrome(word):
    for i in range(len(word) // 2):
        if word[i] != word[len(word) - 1 - i]:
            return False
    return True

print(isPalindrome("racecar"))
print(isPalindrome("hello"))
print(isPalindrome("madam"))
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
def isPalindromeSentence(text):
    cleaned = ""
    for char in text:
        if char.isalpha():
            cleaned += char.lower()
    return cleaned == cleaned[::-1]

print(isPalindromeSentence("A man a plan a canal Panama"))
print(isPalindromeSentence("racecar"))
print(isPalindromeSentence("hello world"))
```
Output
```text
True
True
False
```
We first **clean** the string: keep only letters and convert to lowercase. Then check if it's a palindrome. Step by step, just like we learned in the decomposition lesson :)

---

Write a function **isPalindrome** that takes a word and returns **True** if it's a palindrome, **False** otherwise. Use a **loop**, not [::-1]

```py
print(isPalindrome("level"))    # True
print(isPalindrome("python"))   # False
print(isPalindrome("abcba"))    # True
print(isPalindrome("ab"))       # False
```

Expected output
```text
True
False
True
False
```