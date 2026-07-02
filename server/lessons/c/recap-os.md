Combine **fork**, **pipes**, and **threads** — all the OS concepts in one challenge

---

## Mission: Word Count on the Punch Tape

A very long punch tape has arrived at the computing center and the words on it need to be counted. A child process does the counting and sends the result back to the parent through a pipe, so it can be logged.

The data is already on the right. Do the following, in order:

1. Write **int count_words(const char \*text)** — counts words separated by spaces
2. Create a pipe, then fork
3. The **child** counts the words in **"The quick brown fox jumps over the lazy dog"**, converts the count to a string with **sprintf**, writes it to the pipe, and exits
4. The **parent** reads the count from the pipe and prints the result, then waits for the child

**Example**

Your program should print

```text
Child counted: 9 words
```

Use **pipe()**, **fork()**, **write()/read()** for pipe communication, and **sprintf()** to format the number
