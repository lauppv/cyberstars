Arrays are great, but they have one big limitation: their **size is fixed**. Once you create an array of 5 elements, it's stuck at 5. You can't add a 6th. In real programs, you often don't know how many items you'll need. Enter **ArrayList**

An **ArrayList** is a **dynamic array** — it grows and shrinks as needed. In Python, regular lists already work this way (you just **append** stuff). In Java, you need ArrayList for that flexibility

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<String>();
        crew.add("Tommy Vercetti");
        crew.add("Lance Vance");
        crew.add("Phil Cassidy");

        System.out.println(crew);
    }
}
```
Output
```text
[Tommy Vercetti, Lance Vance, Phil Cassidy]
```

A few things to unpack here

---

First, the **import**. ArrayList lives in the **java.util** package, so we need to import it at the top of the file. This is like Python's **from collections import something** — Java just needs you to be explicit about what you're using

---

Second, the **\<String\>** part. This is called a **generic type**. It tells Java what type of things the list holds. Think of it as a label on a box: **ArrayList\<String\>** is "a list that holds Strings." You can also have **ArrayList\<Integer\>**, **ArrayList\<Double\>**, etc.

Small gotcha: you can't use primitive types like **int** or **double** directly. You have to use their "wrapper" versions: **Integer**, **Double**, **Boolean**. Java auto-converts between them, so it's mostly painless

```java
ArrayList<Integer> scores = new ArrayList<Integer>();
scores.add(100);    // Java auto-converts int 100 to Integer 100
scores.add(85);
scores.add(92);
System.out.println(scores);   // [100, 85, 92]
```

---

The main methods you'll use on an ArrayList

**add(item)** — adds an item to the end
```java
ArrayList<String> list = new ArrayList<String>();
list.add("first");
list.add("second");
// list is now [first, second]
```

**get(index)** — gets the item at that index (starting from 0, like arrays)
```java
System.out.println(list.get(0));   // first
System.out.println(list.get(1));   // second
```

**size()** — returns how many items are in the list
```java
System.out.println(list.size());   // 2
```

Notice it's **.size()** with parentheses, not **.length** like arrays. Yes, this is another one of Java's charming inconsistencies

**remove(index)** — removes the item at that index, and shifts everything after it down
```java
list.remove(0);   // removes "first"
// list is now [second]
```

---

Let's see it all together. Lance is managing Cortez's guest list for a yacht party

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> guests = new ArrayList<String>();

        guests.add("Tommy");
        guests.add("Lance");
        guests.add("Mercedes");
        guests.add("Sonny");

        System.out.println("Guest count: " + guests.size());
        System.out.println("First guest: " + guests.get(0));

        // Sonny is NOT invited
        guests.remove(3);
        System.out.println("After removal: " + guests);
    }
}
```
Output
```text
Guest count: 4
First guest: Tommy
After removal: [Tommy, Lance, Mercedes]
```

---

In Python, this would be
```python
guests = ["Tommy", "Lance", "Mercedes", "Sonny"]
print(len(guests))
print(guests[0])
guests.pop(3)   # or del guests[3]
print(guests)
```

Pretty similar! Java just needs more ceremony with the types

---

Create an ArrayList of Strings called **games**. Add these 3 games: **"GTA"**, **"Minecraft"**, **"Zelda"**

Then add a 4th game: **"Elden Ring"**

Then remove the 2nd game (index 1)

Finally, print each game on its own line using a for loop with **.get(i)** and **.size()**

Expected output
```text
GTA
Zelda
Elden Ring
```
