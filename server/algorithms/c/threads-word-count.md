# Medium · Word Count with Mutex

Two threads each receive a sentence and count the words in it. The threads add their result to a shared global counter, protected by a **mutex** — otherwise two concurrent writes can lose increments.

A word is any maximal run of non-space characters. Each thread counts locally first, then takes the lock **once** at the end to add its contribution to the total — we don't hold the mutex for long.

### Input

- Line 1: the first sentence (up to 200 characters).
- Line 2: the second sentence (up to 200 characters).

### Output

- A single line: `Total words: X` where X is the total number of words across both sentences.

### Examples

```
Input:
hello world
the code is clean
Output:
Total words: 6
```

```
Input:
one two three four
five six
Output:
Total words: 6
```

Use **pthread_create**, **pthread_join** and **pthread_mutex_lock/unlock** from `pthread.h`.
