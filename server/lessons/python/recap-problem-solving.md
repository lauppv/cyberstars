Combine **string reverse**, **palindrome**, **anagram**, **filter/transform**, and **two pointers**

---

## Mission: Transmission Toolkit

Incoming transmissions are noisy and scrambled. Build a small toolkit of helper functions, then use them together to make sense of the signal. Pull together everything from this chapter:

**clean_text(text)** — **filter and transform**: keep only the letters and convert them to lowercase (use `.isalpha()`).

**is_palindrome(word)** — check whether the word reads the same both ways, using the **two pointers** technique (one pointer at the start, one at the end, move them towards the centre).

**are_anagrams(a, b)** — clean both words, then check whether they are anagrams (same letters, different order). Sort the letters and compare.

**reverse_words(sentence)** — reverse the **order of the words** in a sentence (not the letters). Split, reverse the list, join back with spaces.

Test with:

```py
print(is_palindrome(clean_text("A man, a plan, a canal: Panama")))
print(are_anagrams("Listen!", "Silent"))
print(reverse_words("navigation system is online"))
print(clean_text("S3ct0r 7 cl34r!"))
```

**Output**

```text
True
True
online is system navigation
sctrclr
```
