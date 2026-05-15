Combine **string methods**, **arrays**, **looping over arrays**, and **break/continue**

---

Build a **word filter**. You have an array of words:

```java
public class Main {
    public static void main(String[] args) {
        String[] words = {"hello", "SPAM", "world", "SPAM", "java", "SPAM", "rocks", "exit", "bonus"};
    }
}
```

Write a method **static String[] filterWords(String[] words)** that:
1. Loops through the array
2. **Skips** any word that equals "SPAM" (use **continue** and **.equals()**)
3. **Stops** when it finds "exit" (use **break**)
4. Converts valid words to **uppercase** (use **.toUpperCase()**)
5. Collects them into a result array and returns it

In main, call the method and print each result, then print the count

Expected output
```text
HELLO
WORLD
JAVA
ROCKS
Total: 4 words
```

Hint: since you don't know the final size, first count valid words in a separate loop, then create the array
