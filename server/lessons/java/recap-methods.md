Combine **return values**, **method overloading**, and **nested loops**

---

Build a **pattern printer** with overloaded methods

Write a method **static String repeat(String s, int times)** that returns the string repeated **times** times (use a loop and concatenation)

**Overload** it: **static String repeat(char c, int times)** — same thing but for a single char

Write **static void printBox(int width, int height)** that uses **nested loops** and the **repeat** method to print a box made of `*` and spaces:

```text
*****
*   *
*   *
*****
```

That's a 5x4 box. The first and last rows are all `*`. The middle rows have `*`, then spaces, then `*`

Call these in main:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(repeat("ab", 3));
        System.out.println(repeat('*', 5));
        printBox(6, 4);
    }
}
```

Expected output
```text
ababab
*****
******
*    *
*    *
******
```
