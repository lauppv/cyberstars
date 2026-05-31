Combine **fork**, **pipes**, and **threads** — all the OS concepts in one challenge

---

## Mission: Deep Space Signal Analysis

The station intercepted a deep-space transmission. The signal is too long to decode in one process, so Tommy splits the work: a child process counts the words and pipes the result back to the parent for logging.

The data is already on the right. Do the following, in order:

1. Write **int countWords(const char \*text)** — counts words separated by spaces
2. Create a pipe, then fork
3. The **child** counts the words in **"The quick brown fox jumps over the lazy dog"**, converts the count to a string with **sprintf**, writes it to the pipe, and exits
4. The **parent** reads the count from the pipe and prints the result, then waits for the child

**Output**

```text
Child counted: 9 words
```

Use **pipe()**, **fork()**, **write()/read()** for pipe communication, and **sprintf()** to format the number
