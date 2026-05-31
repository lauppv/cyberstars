Combine **string methods**, **arrays**, **looping over arrays**, and **break/continue**

---

## Mission: Comms Signal Filter

The station's communication array is picking up corrupted transmissions. Some messages are spam, and the stream cuts off at an `"exit"` signal. Write a filter that cleans up the incoming data.

The data is already on the right:

```java
String[] words = {"hello", "SPAM", "world", "SPAM", "java", "SPAM", "rocks", "exit", "bonus"};
```

Write a method **`static String[] filterWords(String[] words)`** that:

1. Loops through the array
2. **Skips** any word that equals `"SPAM"` (use `continue` and `.equals()`)
3. **Stops** when it finds `"exit"` (use `break`)
4. Converts valid words to **uppercase** (use `.toUpperCase()`)
5. Collects them into a result array and returns it

In main, call the method, print each result, then print the count. Hint: since you don't know the final size, first count valid words in a separate loop, then create the array.

**Output**

```text
HELLO
WORLD
JAVA
ROCKS
Total: 4 words
```
