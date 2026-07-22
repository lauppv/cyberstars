Two threads count occurrences of lowercase letters in a string, sharing a 26-slot array (the histogram). Every increment of the histogram is protected by a **mutex** because both threads may touch the same slot at the same moment.

Thread t1 processes the first half of the string, t2 the second. The main thread joins both and prints the letters that appeared at least once, in alphabetical order.

### Input

- Line 1: a string of at most 200 characters, made up only of lowercase letters (no spaces).

### Output

- One line per letter that appears in the string, in alphabetical order, as `x: k` (the letter and its frequency).

### Examples

```
Input:
programming
Output:
a: 1
g: 2
i: 1
m: 2
n: 1
o: 1
p: 1
r: 2
```

```
Input:
aabbcc
Output:
a: 2
b: 2
c: 2
```

Use **pthread_create**, **pthread_join** and a shared **pthread_mutex_t**.
