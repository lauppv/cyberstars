Combine **string reverse**, **palindrome**, **anagram**, **filter/transform**, and **two pointers**

---

Build a **word game toolkit**. Write these functions:

**clean_word(word)** — **filter and transform**: remove non-letter characters and convert to lowercase. Use a loop or list comprehension with **.isalpha()**

**is_palindrome(word)** — check if the cleaned word is a palindrome using the **two pointers** technique (one pointer at start, one at end, move towards center)

**are_anagrams(word1, word2)** — check if two cleaned words are anagrams (same letters, different order). Sort the letters and compare

**reverse_words(sentence)** — reverse the **order of words** in a sentence (not the letters). Split, reverse the list, join back

Test with:

```python
print(is_palindrome("A man, a plan, a canal: Panama"))
print(are_anagrams("Listen!", "Silent"))
print(reverse_words("hello world foo bar"))
print(clean_word("H3ll0, W0rld!"))
```

Expected output

```text
True
True
bar foo world hello
hllwrld
```
