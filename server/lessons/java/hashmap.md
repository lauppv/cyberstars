In Python, you had **dictionaries** — those awesome key-value pairs where you could look up a value by its key. In Java, the equivalent is **HashMap**

Think of it like Tommy Vercetti's contact list. Each name (the **key**) maps to a phone number (the **value**). You look up the name, you get the number. Fast and simple

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, String> contacts = new HashMap<String, String>();
        contacts.put("Tommy", "555-0001");
        contacts.put("Lance", "555-0002");
        contacts.put("Cortez", "555-0003");

        System.out.println(contacts.get("Tommy"));
        System.out.println(contacts.get("Lance"));
    }
}
```
Output
```text
555-0001
555-0002
```

---

Let's break down that type: **HashMap\<String, String\>**. The first type in the angle brackets is the **key type**, the second is the **value type**. So this map has String keys and String values

You can mix types. Want String keys and Integer values? That's **HashMap\<String, Integer\>**

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<String, Integer>();
        scores.put("Tommy", 9500);
        scores.put("Lance", 7200);
        scores.put("Phil", 3100);

        System.out.println("Tommy's score: " + scores.get("Tommy"));
    }
}
```
Output **Tommy's score: 9500**

Just like with ArrayList, you can't use primitive types directly — use **Integer** instead of **int**, **Double** instead of **double**, etc.

---

The main HashMap methods

**put(key, value)** — adds or updates a key-value pair
```java
public class Main {
    public static void main(String[] args) {
        scores.put("Tommy", 9500);     // adds Tommy
        scores.put("Tommy", 10000);    // updates Tommy's score to 10000
    }
}
```

**get(key)** — gets the value for that key (returns **null** if the key doesn't exist)
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scores.get("Tommy"));   // 10000
        System.out.println(scores.get("Sonny"));   // null
    }
}
```

**containsKey(key)** — checks if a key exists, returns true/false
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scores.containsKey("Tommy"));   // true
        System.out.println(scores.containsKey("Sonny"));    // false
    }
}
```

**keySet()** — returns all the keys (useful for looping, which we'll cover next lesson)
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scores.keySet());   // [Tommy, Lance, Phil] (order may vary)
    }
}
```

**size()** — returns how many key-value pairs are in the map
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scores.size());   // 3
    }
}
```

---

In Python you'd write
```python
scores = {"Tommy": 9500, "Lance": 7200, "Phil": 3100}
print(scores["Tommy"])
print("Tommy" in scores)
```

Java's version is more verbose but the concept is identical. **put** is like Python's **scores["Tommy"] = 9500**, and **get** is like **scores["Tommy"]**

---

One important difference from Python: HashMap does **NOT** guarantee order. If you add Tommy first, then Lance, then Phil, when you print the map or loop over it, they might come out in **any order**. Don't rely on insertion order with HashMap. (If you need order, there's **LinkedHashMap**, but we'll keep things simple for now)

---

Here's a practical example. Cortez is tracking how many missions each crew member has completed

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> missions = new HashMap<String, Integer>();
        missions.put("Tommy", 47);
        missions.put("Lance", 12);
        missions.put("Phil", 8);

        if (missions.containsKey("Tommy")) {
            System.out.println("Tommy completed " + missions.get("Tommy") + " missions");
        }

        // Update a value
        missions.put("Lance", missions.get("Lance") + 1);
        System.out.println("Lance now has " + missions.get("Lance") + " missions");
    }
}
```
Output
```text
Tommy completed 47 missions
Lance now has 13 missions
```

---

Create a **HashMap\<String, Integer\>** called **scores** that maps player names to their scores. Add these three players

- **"Tommy"** with score **9500**
- **"Lance"** with score **7200**
- **"Phil"** with score **3100**

Then print each player and their score on its own line, in this format: **Name: score**

You can use **.get()** for each player individually

Expected output (print them in this order)
```text
Tommy: 9500
Lance: 7200
Phil: 3100
```
