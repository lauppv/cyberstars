A **HashMap** is a structure that stores **key-value** pairs. Think of it like Tommy's contact list — each name (the key) maps to a phone number (the value). You look up the name, you get the number

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

**HashMap\<String, String\>** — the first type is for keys, the second for values. You can mix them: **HashMap\<String, Integer\>** has String keys and numeric values. Just like ArrayList, you use **Integer** instead of **int**, **Double** instead of **double**

---

Main methods

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<String, Integer>();

        // put -- adds or updates a pair
        scores.put("Tommy", 9500);
        scores.put("Lance", 7200);
        scores.put("Tommy", 10000);  // updates Tommy's score

        // get -- value for a key (null if not found)
        System.out.println("Tommy: " + scores.get("Tommy"));
        System.out.println("Sonny: " + scores.get("Sonny"));

        // containsKey -- checks if a key exists
        System.out.println(scores.containsKey("Lance"));

        // size -- how many pairs
        System.out.println("Total: " + scores.size());
    }
}
```

Output

```text
Tommy: 10000
Sonny: null
true
Total: 2
```

`put` with the same key doesn't add a duplicate — it **updates** the existing value

---

**Iterating with keySet()** — get all keys and loop with for-each

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<String, Integer>();
        scores.put("Tommy", 9500);
        scores.put("Lance", 7200);
        scores.put("Phil", 3100);

        for (String name : scores.keySet()) {
            System.out.println(name + ": " + scores.get(name));
        }
    }
}
```

Output (order may vary — HashMap doesn't guarantee order)

```text
Tommy: 9500
Phil: 3100
Lance: 7200
```

Read `for (String name : scores.keySet())` as: "for each key in the map"

---

**Iterating with entrySet()** — when you want the key and value directly, without an extra `.get()` call

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

`Map.Entry<String, Integer>` holds a key-value pair. `.getKey()` returns the key, `.getValue()` returns the value

---

Let's filter — Sonny Forelli wants to know who owes him more than $5000

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

Only Tommy and Phil show up — they owe more than $5000

---

HashMap does **not** guarantee order. If you add Tommy, Lance, Phil, they might come out in any order when you iterate. Don't rely on insertion order

---

## Mission: Mission Log

Cortez keeps track of how many missions each crew member has completed. Tommy completed 47, Lance 12, Phil 8, and Mercedes 23. Cortez wants a report showing only those who completed more than 15 missions

Store the four mission counts in variables `count1` (Tommy), `count2` (Lance), `count3` (Phil), and `count4` (Mercedes). Build a `HashMap<String, Integer>` that maps each member's name to their count. Iterate through the map and print only the members whose count exceeds `15`, in the format `name: count`

**Example** (order may vary)

```text
Tommy: 47
Mercedes: 23
```
