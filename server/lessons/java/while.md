**for** loops are great when we know **how many times** we want to repeat. But sometimes we want to keep going **as long as** something is true, without knowing in advance how many iterations that means. This is the job of **while**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i < 10) {
            System.out.println(i);
            i++;
        }
    }
}
```

Output

```text
0
1
2
3
4
5
6
7
8
9
```

Why no **10**? Because when **i = 10**, the condition **10 < 10** is **false**, so we exit. If we wanted **10** included, we'd use the condition **i <= 10**

---

**while** runs **as long as** the condition is **true**

**Be very careful**. If we forget to update **i** inside the loop, we get an **infinite loop**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i <= 100) {
            System.out.println(i);
            // we forgot i++
        }
    }
}
```

**i** stays **0** forever, so the condition is always **true**, and the program prints **0** non-stop. Whenever you write a **while**, ask yourself: "what makes this condition eventually become false?". If the answer is "nothing", you have a problem

---

When to choose **for** vs **while**?

- **for** when you know the count ("do this 10 times", "go through every element of an array")
- **while** when the stopping condition depends on something computed inside the loop ("keep asking the user until they type **quit**", "keep dividing by 2 until the number drops below 1")

Both are equally powerful. Style and readability decide which one you pick

---

Sometimes, in the middle of a loop, we want to say "that's enough, stop" or "skip this one, move to the next". For that we have **break** and **continue**

**break** **stops** the loop completely. The remaining iterations never happen

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            if (i == 5) {
                break;
            }
            System.out.println(i);
        }
    }
}
```

Output

```text
0
1
2
3
4
```

We told the loop to go up to **99**, but as soon as **i** became **5**, **break** kicked in and the loop ended. The numbers **5, 6, 7, ..., 99** never printed

A real example: searching a name in an array. As soon as we find the target, there's no point checking the rest

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez", "Phil", "Sonny" };
        String target = "Cortez";

        for (String name : names) {
            if (name.equals(target)) {
                System.out.println("Found " + target);
                break;
            }
            System.out.println("Checking " + name);
        }
    }
}
```

Output

```text
Checking Tommy
Checking Lance
Found Cortez
```

The loop didn't check **Phil** and **Sonny** — we already found what we wanted

---

**continue** is different. It doesn't stop the loop — it just **skips the rest** of the current iteration and **jumps to the next** one

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            if (i == 5) {
                continue;
            }
            System.out.println(i);
        }
    }
}
```

Output

```text
0
1
2
3
4
6
7
8
9
```

**5** is missing. When **i** was **5**, **continue** fired, jumped over **System.out.println**, and the loop continued from **i = 6**

A real example: print only **even** numbers

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i <= 10; i++) {
            if (i % 2 != 0) {
                continue;
            }
            System.out.println(i);
        }
    }
}
```

Output: **0 2 4 6 8 10**

---

**break** and **continue** work the same way in **while**. A handy combination is **while (true)** — a loop that would normally be infinite — which we escape with **break**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (true) {
            if (i >= 5) {
                break;
            }
            System.out.println(i);
            i++;
        }
    }
}
```

One trap: inside a **while**, **continue** jumps straight back to the condition. If you haven't already updated the counter, the condition never changes and you get an infinite loop. So inside a **while**, update the counter **before** **continue**

---

## Mission: Cracking the Safe

Tommy found Diaz's safe and tries the combinations one by one: **1**, then **2**, then **3**, and so on upward. You don't know in advance how many tries it takes — exactly the kind of problem for **while (true)** plus **break**.

Store the safe's secret combination. Then use a **while (true)** loop that counts the attempts starting from **1**. On each attempt:

- if the current attempt equals the secret combination → print `Safe open` and leave the loop with **break**
- otherwise → print `Trying N`, where **N** is the attempt number, then move to the next

**Example** for secret combination **3**:

```text
Trying 1
Trying 2
Safe open
```

**Example** for secret combination **1** (opens on the first try):

```text
Safe open
```

**Example** for secret combination **5**:

```text
Trying 1
Trying 2
Trying 3
Trying 4
Safe open
```
