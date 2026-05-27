Time for a real project! We're going to build an **inventory system** — like the weapon/item inventory in GTA Vice City. Tommy picks up items, stores them, and needs to know what he's got and how much it's all worth

This project brings together everything you've learned: **classes**, **constructors**, **ArrayLists**, **methods**, and **loops**. Let's build it piece by piece

---

**Step 1: The Item class**

Every item in our inventory has a **name**, a **quantity**, and a **price** per unit. Let's model that

```java
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

The `Inventory` class holds a list of items and provides methods to manage them. This is where ArrayList comes in — we don't know how many items Tommy will collect, so a fixed-size array won't cut it

```java
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

The inventory starts empty. `addItem` just adds an item to the list. Think of it like Tommy walking over a pickup icon — the item goes into inventory

---

**Step 3: Removing items**

For `removeItem`, we'll search by name and remove the first match. We need a regular for loop (not for-each) because we need the index to remove

```java
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

```java
public class Main {
    void printAll() {
        for (Item item : items) {
            System.out.println(item.name + " x" + item.quantity + " @ $" + String.format("%.2f", item.price));
        }
    }
}
```

For an item named "Health Pack" with quantity 3 and price 25.50, this prints:

```text
Health Pack x3 @ $25.50
```

---

**Step 5: Calculating total value**

The total value is the sum of `quantity * price` for every item. Classic loop-and-accumulate pattern

```java
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
        inv.addItem(new Item("Pistol", 1, 100.00));
        inv.addItem(new Item("Health Pack", 5, 25.00));
        inv.addItem(new Item("Body Armor", 2, 75.50));

        inv.printAll();
        System.out.println("Total: $" + String.format("%.2f", inv.totalValue()));
    }
}
```

Output

```text
Pistol x1 @ $100.00
Health Pack x5 @ $25.00
Body Armor x2 @ $75.50
Total: $376.00
```

---

Notice how the classes work together: `Item` is a simple data container, and `Inventory` manages a collection of items. This is **composition** — the Inventory **has** a list of Items. It's one of the most common patterns in real-world Java

Also notice: `Item` and `Inventory` are NOT public — only `Main` is public. That's because Java only allows one public class per file, and since the file is compiled as `Main.java`, the public class must be `Main`

---

Your turn! Build the full inventory system:

1. Create an `Item` class with fields: `name` (String), `quantity` (int), `price` (double) and a constructor
2. Create an `Inventory` class with an `ArrayList<Item>`, and methods: `addItem(Item item)`, `removeItem(String name)`, `printAll()`, and `double totalValue()`
3. In main, create an Inventory and add these 3 items:
   - "Shotgun", quantity 2, price 350.00
   - "Medkit", quantity 10, price 15.50
   - "Kevlar Vest", quantity 1, price 200.00
4. Call `printAll()` to show all items
5. Print the total value as: `Total: $` followed by the value with 2 decimal places

Expected output:

```text
Shotgun x2 @ $350.00
Medkit x10 @ $15.50
Kevlar Vest x1 @ $200.00
Total: $1055.00
```
