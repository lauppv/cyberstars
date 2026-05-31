You know how to create a HashMap and add stuff. Now let's **loop over it** — because manually calling **.get()** for every key gets old fast when you have 50 entries

---

**Way 1: Loop over the keys with keySet()**

The **.keySet()** method gives you all the keys. You can loop over them with a for-each loop, then use **.get(key)** to grab each value

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<String, Integer>();
        scores.put("Tommy", 9500);
        scores.put("Lance", 7200);
        scores.put("Phil", 3100);

        for (String name : scores.keySet()) {
            System.out.println(name + " scored " + scores.get(name));
        }
    }
}
```

Output (order may vary since HashMap doesn't guarantee order)

```text
Tommy scored 9500
Phil scored 3100
Lance scored 7200
```

Read **for (String name : scores.keySet())** as: "for each String called name **in** the set of keys." It's like Python's **for name in scores:**

---

**Way 2: Loop over entries with entrySet()**

Sometimes you want **both** the key and value at the same time without calling **.get()** separately. That's what **entrySet()** gives you — a set of **Map.Entry** objects, each holding a key-value pair

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<String, Integer>();
        scores.put("Tommy", 9500);
        scores.put("Lance", 7200);
        scores.put("Phil", 3100);

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
```

Output (order may vary)

```text
Tommy -> 9500
Phil -> 3100
Lance -> 7200
```

Yes, **Map.Entry\<String, Integer\>** looks intimidating. Let's break it down

- **Map.Entry** is a type that represents one key-value pair
- **\<String, Integer\>** matches the types of your HashMap
- **entry.getKey()** gives you the key
- **entry.getValue()** gives you the value

It's more typing than keySet(), but it's slightly more efficient for large maps because you don't have to look up each value separately

---

In Python, this would be

```python
for name, score in scores.items():
    print(f"{name} -> {score}")
```

Python's **.items()** is like Java's **.entrySet()**, and Python's **.keys()** is like Java's **.keySet()**. Same concepts, different syntax

---

Let's do something practical. Sonny Forelli wants to find which crew members owe him more than $5000

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> debts = new HashMap<String, Integer>();
        debts.put("Tommy", 10000);
        debts.put("Lance", 3000);
        debts.put("Phil", 7500);
        debts.put("Cortez", 500);

        for (String name : debts.keySet()) {
            if (debts.get(name) > 5000) {
                System.out.println(name + " owes $" + debts.get(name));
            }
        }
    }
}
```

This prints only Tommy and Phil (they owe more than 5000). The loop checks each entry and filters based on the value

---

You can also loop over just the **values** with **.values()**, though this is less common since you usually want the key too

```java
public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int debt : debts.values()) {
            total += debt;
        }
        System.out.println("Total debt: $" + total);
    }
}
```

Output **Total debt: $21000**

---

## Mission: Signal Frequency Scanner

The station's communications array has been intercepting keyword signals from deep space. Your job is to scan the log and flag any keyword that appeared more than once — those could be repeating distress calls.

Create a **HashMap\<String, Integer\>** called `wordCount` with these signal entries:

1. `"java"` appeared `5` times
2. `"python"` appeared `3` times
3. `"bug"` appeared `1` time
4. `"loop"` appeared `1` time
5. `"class"` appeared `4` times

Loop through the map and print only the keywords that appear more than once, in the format `word: count`.

**Input** (already set in your code — change the values to test):

- `"java"`, `"python"`, `"bug"`, `"loop"`, `"class"` — intercepted keywords
- `5`, `3`, `1`, `1`, `4` — how many times each was detected

**Example**

With the starter values, your program should print (order may vary)

```text
java: 5
python: 3
class: 4
```
