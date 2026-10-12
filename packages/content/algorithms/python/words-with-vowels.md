Given a sentence, print every word that contains **exactly 2 vowels**.

### Input

A single line of 1 to 10^5 characters containing a sentence with at least one word. Words contain only English letters (`a`-`z`, `A`-`Z`) and are separated by one or more spaces, and the line may start or end with spaces.

### Output

The matching words, each on a separate line, in the order they appear. If no words match, print nothing. The vowels are `a`, `e`, `i`, `o`, `u`, uppercase or lowercase.

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
0), so nothing is printed at all, not even a blank line.

```
Input:  bee tree free
Output:
bee
tree
free
```

Every word can match. There's no rule saying only some words are allowed to.
