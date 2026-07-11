Welcome to one of the **most important** concepts in programming — the **for** loop. With it, we can ask the computer to do something **many times**, **automatically**

Why does it matter? Imagine we want to display all numbers from **1** to **10**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);
        // ... and so on, ten times
    }
}
```

Tedious. Now imagine **1** to **1000**. Absolutely no chance we write **1000 println**s. This is where **for** saves us

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
```

Run it. You'll see numbers from **1** to **10**, one per line

---

The Java **for** loop has **three parts** inside the parentheses, separated by **;**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
```

1. **int i = 1** — the **starting point**. We create a new variable **i** and set it to **1**
2. **i <= 10** — the **condition**. As long as this is **true**, the loop keeps running
3. **i++** — what to do **after each iteration**. Here we increase **i** by 1

Reading it like a story: "start with **i = 1**. While **i <= 10**, run the body. After each run, do **i++**"

So **i** takes the values **1, 2, 3, 4, 5, 6, 7, 8, 9, 10**. When **i** becomes **11**, the condition **11 <= 10** is **false**, and the loop ends

---

The three parts are entirely under your control. We can count by 2s, count down, do whatever we want

```java
public class Main {
    public static void main(String[] args) {
        // counting by 2s
        for (int i = 0; i <= 10; i = i + 2) {
            System.out.println(i);
        }
    }
}
```

Output: 0, 2, 4, 6, 8, 10

```java
public class Main {
    public static void main(String[] args) {
        // counting down
        for (int i = 10; i >= 1; i--) {
            System.out.println(i);
        }
    }
}
```

Output: 10, 9, 8, ..., 1. **i--** means **i = i - 1**

---

A common mistake: forgetting to update **i**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; ) {
            System.out.println(i);
        }
    }
}
```

This is an **infinite loop**. **i** stays **1** forever, the condition stays **true** forever, and the program prints **1** until you stop it. Always make sure something inside the loop moves the condition closer to becoming **false**

---

We can put **anything** in the loop body, including an **if**. Here we go through sectors 1 to 5 and mark sector 3 as the one to patrol

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            if (i == 3) {
                System.out.println("Patrol sector");
            } else {
                System.out.println(i);
            }
        }
    }
}
```

Output

```text
1
2
Patrol sector
4
5
```

---

## Mission: Garage Inspection

Tommy is inspecting the Vercetti mansion garage. The parking spots are numbered from **1** up to a total. One of the spots holds his **Infernus** — there, instead of the number, you want to print the car's name.

Store the total number of spots in an `int` named `totalSpots` and the spot where the Infernus sits in `infernusSpot`. Then use a **for** loop that goes through the spots from **1** to the total. For each spot:

- if it is the spot holding the Infernus → print `Infernus`
- otherwise → print the spot number

**Example** for **5** spots, with the Infernus on spot **3**:

```text
1
2
Infernus
4
5
```

**Example** for **5** spots, with the Infernus on spot **1** (the first):

```text
Infernus
2
3
4
5
```

**Example** for **5** spots, with the Infernus on spot **5** (the last):

```text
1
2
3
4
Infernus
```
