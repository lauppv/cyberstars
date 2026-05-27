**for** and **while** loops do their job from start to finish. But what if, in the middle of a loop, we want to say "ok, that’s enough, stop"? Or "skip this one, next"?

Java gives us **break** and **continue** — same names, same behavior as in many languages

---

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

A real example: searching a name in an array

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez", "Phil", "Sonny" };
        String target = "Cortez";

        for (String name : names) {
            if (name.equals(target)) {
                System.out.println("Found " + target + "!");
                break;
            }
            System.out.println("Checking " + name + "...");
        }
    }
}
```

Output

```text
Checking Tommy...
Checking Lance...
Found Cortez!
```

The loop didn’t check **Phil** and **Sonny** — we already found what we wanted. **break** saved us time

---

**continue** is different. It doesn’t stop the loop — it just **skips the rest** of the current iteration and **jumps to the next** one

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

Both keywords work the same way in **while**, not just **for**

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

**while (true)** would normally be infinite, but **break** lets us escape

---

A small warning: **break** and **continue** can make code harder to read if you abuse them. Use them when they make the logic clearer, not just to be clever :)

---

Print all numbers from **1 to 20**, but with two rules

- **Skip** the number **13** (use **continue**)
- **Stop** completely when you reach **17** (use **break**, do not print **17** itself)

Expected output

```text
1
2
3
4
5
6
7
8
9
10
11
12
14
15
16
```

**13** is missing, and **17, 18, 19, 20** never show up
