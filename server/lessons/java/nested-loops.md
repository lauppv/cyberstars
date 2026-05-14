You already know how loops work. Now let's put a **loop inside a loop** — a **nested loop**. It sounds intense, but the concept is simple: the **outer loop** runs, and for **each iteration** of the outer loop, the **inner loop** runs **completely**

Think of it like Sonny Forelli sending Tommy on missions. Sonny has a list of 3 neighborhoods. For **each** neighborhood, Tommy has to visit **5 buildings**. That's 3 x 5 = 15 total visits. Nested loop

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.println("i=" + i + " j=" + j);
            }
        }
    }
}
```
Output
```text
i=1 j=1
i=1 j=2
i=1 j=3
i=2 j=1
i=2 j=2
i=2 j=3
i=3 j=1
i=3 j=2
i=3 j=3
```

See the pattern? When **i=1**, the inner loop runs j from 1 to 3. Then i becomes 2, and j runs from 1 to 3 again. And so on. The inner loop **resets every time** the outer loop moves forward

---

Nested loops are perfect for **grids** and **patterns**. Let's print a 4x4 grid of stars

```java
public class Main {
    public static void main(String[] args) {
        for (int row = 0; row < 4; row++) {
            for (int col = 0; col < 4; col++) {
                System.out.print("* ");
            }
            System.out.println();  // new line after each row
        }
    }
}
```
Output
```text
* * * * 
* * * * 
* * * * 
* * * * 
```

Notice we used **System.out.print** (no "ln") inside the inner loop — that prints without jumping to a new line. Then **System.out.println()** at the end of each row starts a new line

---

Here's where it gets fun. We can make the inner loop depend on the outer loop's variable. Let's print a triangle

```java
public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 4; row++) {
            for (int col = 0; col < row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
```
Output
```text
*
**
***
****
```

The trick: when **row=1**, the inner loop runs **1 time**. When **row=2**, it runs **2 times**. When **row=3**, **3 times**. The inner loop's limit is **row**, not a fixed number

---

We can also use nested loops to build a multiplication table. Cortez would appreciate the organization

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print(i * j + "\t");
            }
            System.out.println();
        }
    }
}
```
Output
```text
1	2	3	
2	4	6	
3	6	9	
```

**\t** is a tab character — it spaces things out nicely in a grid

---

In Python, you might have written something like
```python
for i in range(5):
    for j in range(i + 1):
        print("*", end="")
    print()
```

The Java version is almost identical in logic, just with different syntax. The **end=""** in Python is like using **System.out.print** instead of **println** in Java

---

Print a **right triangle** of stars with **5 rows**

Row 1 has 1 star, row 2 has 2 stars, all the way to row 5 with 5 stars. Each star is just the **\*** character with no spaces between them

Expected output
```text
*
**
***
****
*****
```

Use a nested loop where the inner loop prints stars, and the outer loop controls how many stars per row
