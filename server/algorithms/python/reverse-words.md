# Reverse Words

Given a sentence, print the **words in reverse order**.

Note: you are reversing the order of the words, not the characters within them.

### Input

A single line containing a sentence of words separated by spaces.

### Output

Print the words in reverse order, separated by spaces.

### Examples

```
Input:  hello world
Output: world hello
```

```
Input:  I love Python
Output: Python love I
```

### Hints

- Use `split()` to get a list of words.
- You can reverse a list with `[::-1]` or the `reversed()` function.
- Use `" ".join(...)` to combine the words back into a single string.
