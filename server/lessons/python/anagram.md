Two words are **anagrams** if they contain exactly the **same letters**, just in a different order. **listen** and **silent**. **evil** and **vile**. **astronomer** and **moon starer** (ok, that last one has a space, but you get the idea)

How do we check? The simplest approach: **sort the letters** and compare

```py
def is_anagram(word1, word2):
    return sorted(word1.lower()) == sorted(word2.lower())

print(is_anagram("listen", "silent"))
print(is_anagram("hello", "world"))
print(is_anagram("Evil", "Vile"))
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
def is_anagram(word1, word2):
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

print(is_anagram("listen", "silent"))
print(is_anagram("hello", "world"))
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

## Mission: Passphrase Match

Two crew members each transmit a scrambled passphrase. The airlock only opens if the two passphrases are **anagrams** of each other — the same letters in a different order (case doesn't matter).

1. Write a function **are_anagrams(a, b)** that returns `True` if the two words are anagrams, `False` otherwise. Use **either** approach (sort the letters and compare, or a frequency dictionary). Lowercase both first so capitals don't matter.
2. **Read** two passphrases, then print `Anagram: ` followed by the result.
3. On the next line, print `Access granted` if they match, or `Access denied` if they don't.

**Input** (typed by the user when the program runs):

- the first passphrase
- the second passphrase

**Output** — two lines: the anagram check, then the access verdict.

**Example**

If the user types

```text
listen
silent
```

the program should print

```text
Anagram: True
Access granted
```

If the user types

```text
orbit
robot
```

the program should print

```text
Anagram: False
Access denied
```
