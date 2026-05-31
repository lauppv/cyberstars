Combine **return values**, **method overloading**, and **nested loops**

---

## Mission: Airlock Display Panel

The station's airlock display panel needs a visual border renderer. You will build it using overloaded methods and nested loops.

1. Write a method **`static String repeat(String s, int times)`** that returns the string repeated `times` times (use a loop and concatenation)
2. **Overload** it: **`static String repeat(char c, int times)`** — same thing but for a single char
3. Write **`static void printBox(int width, int height)`** that uses nested loops and the `repeat` method to print a box made of `*` and spaces. The first and last rows are all `*`. The middle rows have `*`, then spaces, then `*`

The test calls in main are already on the right.

**Output**

```text
ababab
*****
******
*    *
*    *
******
```
