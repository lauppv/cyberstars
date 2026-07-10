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
palindrome_text = "A man, a plan, a canal: Panama"
anagram_a = "Listen!"
anagram_b = "Silent"
sentence = "navigation system is online"
messy = "S3ct0r 7 cl34r!"
print(is_palindrome(clean_text(palindrome_text)))
print(are_anagrams(anagram_a, anagram_b))
print(reverse_words(sentence))
print(clean_text(messy))
```

**Output**

```text
True
True
online is system navigation
sctrclr
```
