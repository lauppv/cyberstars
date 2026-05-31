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

Run it. You’ll see numbers from **1** to **10**, one per line

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

This is **different from Python**. In Python we wrote **for i in range(1, 11)**. In Java we are more explicit, but more flexible too. We can count by 2s, count down, do whatever we want

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

This is an **infinite loop**. **i** stays **1** forever, the condition stays **true** forever, and the program prints **1** until you stop it. Run it (briefly) to see what happens, then close it :)

---

## Mission: Sector Scan

The station's scanner sweeps through **all sectors** from `startSector` to `endSector`. Most sectors get a normal numeric readout, but two special sectors (`alertSector1` and `alertSector2`) trigger a **Pizza Margherita** signal instead of the number.

Write a program that uses a **for** loop to go through every sector number from `startSector` to `endSector`. For each sector:

- if the sector is `alertSector1` or `alertSector2` → print `Pizza Margherita`
- otherwise → print the sector number

**Input** (already set at the top of your code — change the values to test):

- `startSector` — first sector to scan
- `endSector` — last sector to scan
- `alertSector1` — first special sector
- `alertSector2` — second special sector

**Example**

With `startSector = 0`, `endSector = 100`, `alertSector1 = 10`, and `alertSector2 = 50`, the first few lines of output should be

```text
0
1
2
...
9
Pizza Margherita
11
...
```

and at sector 50 you'll see another `Pizza Margherita`
