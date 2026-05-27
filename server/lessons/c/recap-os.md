Combine **fork**, **pipes**, and **threads** — all the OS concepts in one challenge

---

Build a **parallel word counter**. The idea: the parent creates a **pipe**, then **forks**. The child counts the words in a given string and sends the count through the pipe to the parent

Write a function **int countWords(const char \*text)** that counts words (sequences separated by spaces). For example, "hello world foo" has 3 words

The program should:

1. Create a pipe
2. Fork
3. **Child**: count the words in **"The quick brown fox jumps over the lazy dog"**, write the count to the pipe as a string (use **sprintf** to convert int to string), then exit
4. **Parent**: read the count from the pipe, print it, wait for the child

Expected output

```text
Child counted: 9 words
```

You'll need: **pipe()** for the pipe, **fork()** for the child, **write()/read()** for pipe communication, **sprintf()** to format the number, and your own **countWords** function using a loop

This is how real programs parallelize work — split the task, send results through pipes
