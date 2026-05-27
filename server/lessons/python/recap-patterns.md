Combine **built-in functions**, **problem decomposition**, **counter**, **accumulator**, and **flag** patterns

---

Build a **text analyzer**. Given this text:

```python
text = "The quick brown fox jumps over the lazy dog and the quick cat"
```

Write **separate functions** for each task (decompose the problem!):

**count_word(text, word)** — uses the **counter pattern** to count how many times a word appears (split the text into words and loop)

**longest_word(text)** — uses the **accumulator pattern** to find the longest word (keep track of the longest seen so far)

**has_duplicate_words(text)** — uses the **flag pattern** to check if any word appears more than once. Return True/False

Also use **built-in functions**: **len()** on the word list to count total words, **sorted()** to get unique words alphabetically

Print the results

Expected output

```text
Total words: 12
Count of 'the': 3
Longest word: jumps
Has duplicates: True
Unique words: and, brown, cat, dog, fox, jumps, lazy, over, quick, the
```
