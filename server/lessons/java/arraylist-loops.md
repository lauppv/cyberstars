Now that you know how to create an ArrayList and add stuff to it, let's talk about **looping over it**. There are two main ways, and both are useful

---

**Way 1: The classic for loop with .get(i)**

This works just like looping over an array, but you use **.size()** instead of **.length** and **.get(i)** instead of **[i]**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        for (int i = 0; i < crew.size(); i++) {
            System.out.println(i + ": " + crew.get(i));
        }
    }
}
```

Output

```text
0: Tommy Vercetti
1: Lance Vance
2: Phil Cassidy
```

Use this when you need the **index** — for example, numbering items or accessing specific positions

---

**Way 2: The for-each loop**

Java has a shortcut called the **for-each** loop (also called the "enhanced for loop"). It's cleaner when you just want each item and don't care about the index

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        for (String name : crew) {
            System.out.println("Member: " + name);
        }
    }
}
```

Output

```text
Member: Tommy Vercetti
Member: Lance Vance
Member: Phil Cassidy
```

Read **for (String name : crew)** as: "for each String called name **in** crew." It's like Python's **for name in crew:** — almost identical

---

Quick comparison table

|          | Array   | ArrayList   |
| -------- | ------- | ----------- |
| Size     | Fixed   | Dynamic     |
| Length   | .length | .size()     |
| Access   | arr[i]  | list.get(i) |
| For-each | works   | works       |

The for-each loop works with **both** arrays and ArrayLists — Java handles the details

```java
public class Main {
    public static void main(String[] args) {
        // For-each with a regular array
        String[] names = {"Tommy", "Lance"};
        for (String name : names) {
            System.out.println(name);
        }

        // For-each with an ArrayList
        ArrayList<String> names2 = new ArrayList<String>();
        names2.add("Tommy");
        names2.add("Lance");
        for (String name : names2) {
            System.out.println(name);
        }
    }
}
```

Same syntax, both work perfectly

---

Here's a practical example. Let's filter an ArrayList — keep only the items we want

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<Integer>();
        numbers.add(10);
        numbers.add(25);
        numbers.add(30);
        numbers.add(7);
        numbers.add(42);

        for (int num : numbers) {
            if (num > 20) {
                System.out.println(num + " is big");
            }
        }
    }
}
```

Output

```text
25 is big
30 is big
42 is big
```

Notice that even though we declared the list as **ArrayList\<Integer\>**, we can use **int num** in the for-each loop. Java automatically unboxes the Integer to an int. Handy

---

Create an ArrayList of Integers called **numbers**. Add these values: **3, 12, 7, 24, 5, 18, 11, 30**

Then loop through the list and print **only the even numbers**, each on its own line

Hint: a number is even if **num % 2 == 0**

Expected output

```text
12
24
18
30
```
