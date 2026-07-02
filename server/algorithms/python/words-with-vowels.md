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
Output:
```

None of these words has exactly 2 vowels (`cat` has 1, `dog` has 1, `fly` has
0), so nothing is printed at all — not even a blank line.

```
Input:  bee tree free
Output:
bee
tree
free
```

Every word can match — there's no rule saying only some words are allowed to.
