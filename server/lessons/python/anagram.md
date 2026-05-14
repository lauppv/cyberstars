Two words are **anagrams** if they contain exactly the **same letters**, just in a different order. **listen** and **silent**. **evil** and **vile**. **astronomer** and **moon starer** (ok, that last one has a space, but you get the idea)

How do we check? The simplest approach: **sort the letters** and compare

```py
def isAnagram(word1, word2):
    return sorted(word1.lower()) == sorted(word2.lower())

print(isAnagram("listen", "silent"))
print(isAnagram("hello", "world"))
print(isAnagram("Evil", "Vile"))
```
Output
```text
True
False
True
```

Why does this work? If two words have the same letters, sorting those letters will produce the **same result**. "listen" sorted → "eilnst". "silent" sorted → "eilnst". Same? Yes → anagram

We use **.lower()** so that uppercase and lowercase don't matter

---

But let's also solve it using what we learned — a **frequency dictionary**. Two words are anagrams if every letter appears the **same number of times** in both words

```py
def isAnagram(word1, word2):
    word1 = word1.lower()
    word2 = word2.lower()
    
    if len(word1) != len(word2):
        return False
    
    freq1 = {}
    for char in word1:
        if char in freq1:
            freq1[char] += 1
        else:
            freq1[char] = 1
    
    freq2 = {}
    for char in word2:
        if char in freq2:
            freq2[char] += 1
        else:
            freq2[char] = 1
    
    return freq1 == freq2

print(isAnagram("listen", "silent"))
print(isAnagram("hello", "world"))
```
Output
```text
True
False
```

We build a frequency dictionary for each word, then compare them. If the dictionaries are equal, the words have the same letters with the same counts → anagram

Notice the **early exit**: if the lengths are different, they can't be anagrams — no need to count anything

---

The frequency approach is actually **faster** than sorting for very long strings. Sorting takes roughly **n × log(n)** steps, while counting takes only **n** steps. For this exercise, both are fine, but it's good to think about these things :)

---

Write a function **isAnagram** that takes two words and returns **True** if they are anagrams, **False** otherwise. You can use **either** approach (sorting or frequency dictionary)

```py
print(isAnagram("cinema", "iceman"))   # True
print(isAnagram("rat", "car"))          # False
print(isAnagram("Dormitory", "Dirty room"))  # this one is tricky!
```

For the first two, expected output
```text
True
False
```

Bonus: can you make it work for **"Dormitory"** and **"Dirty room"** by ignoring spaces? Try it :)