# Words with Two Vowels

Given a sentence, print every word that contains **exactly 2 vowels**.

### Input
A single line containing a sentence (words separated by spaces, only letters).

### Output
The matching words, each on a separate line, in the order they appear. If no words match, print nothing.

### Examples

```
Input:  hello world apple
Output:
hello
apple
```

```
Input:  cat dog fly
Output: (nothing)
```

### Hints
- Use `.split()` to break the sentence into words.
- For each word, count how many characters are in `"aeiouAEIOU"`.
- A `for` loop inside a `for` loop — one for words, one for characters.
