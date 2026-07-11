Time for a real project! We're going to build an **inventory system** — Tommy manages the station's supply depot, keeps track of provisions and needs to know what he's got and how much it's all worth

This project brings together everything you've learned: **classes**, **constructors**, **ArrayLists**, **methods**, and **loops**. Let's build it piece by piece

---

**Step 1: The Item class**

Every item in our inventory has a **name**, a **quantity**, and a **price** per unit. Let's model that

```text
class Item {
    String name;
    int quantity;
    double price;

    Item(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}
```

Simple and clean. An `Item` knows its name, how many we have, and what each one costs. The constructor takes all three values and sets them up

---

**Step 2: The Inventory class**

The `Inventory` class holds a list of items and provides methods to manage them. This is where ArrayList comes in — we don't know how many supplies will be stored, so a fixed-size array won't cut it

```text
import java.util.ArrayList;

class Inventory {
    ArrayList<Item> items;

    Inventory() {
        items = new ArrayList<>();
    }

    void addItem(Item item) {
        items.add(item);
    }
}
```

The inventory starts empty. `addItem` adds an item to the list

---

**Step 3: Removing items**

For `removeItem`, we'll search by name and remove the first match. We need a regular for loop (not for-each) because we need the index to remove

```text
public class Main {
    void removeItem(String name) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).name.equals(name)) {
                items.remove(i);
                return;
            }
        }
    }
}
```

We loop through items, check if the name matches, remove it, and **return** immediately (no point continuing after we found and removed it)

---

**Step 4: Printing all items**

Let's print each item in a nice format. This is where String.format comes in handy

```text
public class Main {
    void printAll() {
        for (Item item : items) {
            System.out.println(item.name + " x" + item.quantity + " @ $" + String.format("%.2f", item.price));
        }
    }
}
```

For an item named "Medical kit" with quantity 5 and price 25.00, this prints:

```text
Medical kit x5 @ $25.00
```

---

**Step 5: Calculating total value**

The total value is the sum of `quantity * price` for every item. Classic loop-and-accumulate pattern

```text
public class Main {
    double totalValue() {
        double total = 0;
        for (Item item : items) {
            total += item.quantity * item.price;
        }
        return total;
    }
}
```

---

Here's the full program put together

```java
import java.util.ArrayList;

class Item {
    String name;
    int quantity;
    double price;

    Item(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}

class Inventory {
    ArrayList<Item> items;

    Inventory() {
        items = new ArrayList<>();
    }

    void addItem(Item item) {
        items.add(item);
    }

    void removeItem(String name) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).name.equals(name)) {
                items.remove(i);
                return;
            }
        }
    }

    void printAll() {
        for (Item item : items) {
            System.out.println(item.name + " x" + item.quantity + " @ $" + String.format("%.2f", item.price));
        }
    }

    double totalValue() {
        double total = 0;
        for (Item item : items) {
            total += item.quantity * item.price;
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventory inv = new Inventory();
        inv.addItem(new Item("Medical kit", 5, 25.00));
        inv.addItem(new Item("Oxygen reserve", 2, 75.50));
        inv.addItem(new Item("Solar battery", 1, 100.00));

        inv.printAll();
        System.out.println("Total: $" + String.format("%.2f", inv.totalValue()));
    }
}
```

Output

```text
Medical kit x5 @ $25.00
Oxygen reserve x2 @ $75.50
Solar battery x1 @ $100.00
Total: $376.00
```

---

Notice how the classes work together: `Item` is a simple data container, and `Inventory` manages a collection of items. This is **composition** — the Inventory **has** a list of Items. It's one of the most common patterns in real-world Java

Also notice: `Item` and `Inventory` are NOT public — only `Main` is public. That's because Java only allows one public class per file, and since the file is compiled as `Main.java`, the public class must be `Main`

---

## Mission: Cargo Bay Manifest

The station's cargo bay needs a digital manifest system. Every supply item has a name, quantity, and unit price. Build the inventory tracker so the quartermaster can list everything and calculate the total value at a glance.

1. Create an `Item` class with fields: `name` (String), `quantity` (int), `price` (double) and a constructor
2. Create an `Inventory` class with an `ArrayList<Item>`, and methods: `addItem(Item item)`, `removeItem(String name)`, `printAll()`, and `double totalValue()`
3. `printAll()` prints each item as `"name xQuantity @ $price"` (use `String.format("%.2f", price)`)
4. `totalValue()` returns the sum of `quantity * price` for all items
5. In main, store each supply's data in variables — `name1`/`quantity1`/`price1`, `name2`/`quantity2`/`price2`, `name3`/`quantity3`/`price3` (start with Air filter/4/35.00, Food pack/10/12.00, Repair kit/3/85.00). Create an `Inventory` and add the three items built from those variables
6. Call `printAll()`, then print `"Total: $"` followed by the formatted total

**Output**

```text
Air filter x4 @ $35.00
Food pack x10 @ $12.00
Repair kit x3 @ $85.00
Total: $515.00
```
