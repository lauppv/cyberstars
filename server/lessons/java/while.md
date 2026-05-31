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

Why no **10**? Because when **i = 10**, the condition **10 < 10** is **false**, so we exit

If we wanted **10** included, we’d write

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i <= 10) {
            System.out.println(i);
            i++;
        }
    }
}
```

Now **10 <= 10** is **true**, so we enter one more time

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

**i** stays **0** forever, so the condition is always **true**, and the program prints **0** non-stop. Run this code (briefly) to see what happens. Don’t worry, the platform stops it after 5 seconds :)

This is a very common bug. Whenever you write a **while**, ask yourself: "what makes this condition eventually become false?". If the answer is "nothing", you have a problem

---

When to choose **for** vs **while**?

- **for** when you know the count ("do this 10 times", "go through every element of an array")
- **while** when the stopping condition depends on something inside the loop ("keep asking the user until they type **quit**", "keep dividing by 2 until the number is below 1")

Both are equally powerful — anything you can do with one, you can do with the other. Style and readability decide :)

---

## Mission: Signal Lost

A crew member's communicator is stuck in an **infinite loop** — it keeps broadcasting `I am online` forever and never shuts down.

Fix the code on the right so the communicator broadcasts **once**, then goes offline. You need to **change** the variable inside the loop so the condition eventually becomes **false**.

**Input** (already set at the top of your code):

- `isOnline` — whether the communicator is active (`true` at the start)

**Example**

After your fix, the program should print exactly

```text
I am online
Now I am offline
```
