Recursion gets easier with practice. The question to ask every time is the same: how is this problem made of a smaller copy of itself? Let's try it on numbers, arrays and Strings

---

**Power.** `2⁵` is `2 × 2⁴`. And anything to the power of 0 is 1, that is the base case

```java
public class Main {
    static int power(int base, int exp) {
        if (exp == 0) {
            return 1;
        }
        return base * power(base, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(power(2, 5));
        System.out.println(power(7, 0));
    }
}
```

Output

```text
32
1
```

---

**The sum of an array.** The sum from position `i` to the end is the value at `i`, plus the sum from `i + 1` to the end. When `i` goes past the end, there is nothing left to add

```java
public class Main {
    static int sumFrom(int[] values, int i) {
        if (i == values.length) {
            return 0;
        }
        return values[i] + sumFrom(values, i + 1);
    }

    public static void main(String[] args) {
        int[] loot = { 50, 20, 30 };
        System.out.println(sumFrom(loot, 0));
    }
}
```

Output

```text
100
```

The array never gets smaller here. What gets smaller is the part still left to add, from `i` to the end. Passing the position along is a common trick

---

**Strings.** A String is its first char plus the rest, and `substring(1)` gives you the rest. Here we count the letter `a`

```java
public class Main {
    static int countA(String text) {
        if (text.isEmpty()) {
            return 0;
        }
        int first = text.charAt(0) == 'a' ? 1 : 0;
        return first + countA(text.substring(1));
    }

    public static void main(String[] args) {
        System.out.println(countA("banana"));
    }
}
```

Output

```text
3
```

`isEmpty()` is true for the String `""`. That is the base case: an empty String has no letters at all

---

**Fibonacci.** Each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8... A method can call itself more than once

```java
public class Main {
    static int fib(int n) {
        if (n < 2) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(10));
    }
}
```

Output

```text
55
```

This one is short and pretty, but slow: `fib(40)` computes the same smaller numbers again and again, hundreds of millions of calls. A loop is the better tool there. Recursion is great when the problem really splits into smaller copies, not always

---

## Mission: Mirror Words

Tommy's crew sends messages backwards, and loves words that read the same both ways. Store a word in a `String` named `word`. Write two recursive methods:

- `reverse` gives back the word turned back to front
- `isPalindrome` gives back `true` when the word reads the same backwards. Compare the first and the last char, then check what is between them

Print the reversed word, then `Palindrome: yes` or `Palindrome: no`. Don't use a loop, and don't use StringBuilder.

**Example** for `word = "level"`

```text
level
Palindrome: yes
```

**Example** for `word = "Tommy"`

```text
ymmoT
Palindrome: no
```

**Example** for `word = "abba"`

```text
abba
Palindrome: yes
```
