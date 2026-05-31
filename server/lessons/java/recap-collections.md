Combine **ArrayList**, **ArrayList loops**, **HashMap**, and **HashMap loops**

---

## Mission: Station Trade Ledger

The station's trading post logged today's sales, but the data is raw. The quartermaster needs a summary report: how many of each item sold, which item sold the most, and which items are popular.

The data is already on the right:

```java
String[] sales = {"Sword", "Shield", "Potion", "Sword", "Potion", "Potion", "Armor", "Sword"};
```

Do the following, in order:

1. Build a **`HashMap<String, Integer>`** counting how many of each item was sold
2. Loop through the HashMap and print each item with its count
3. Find the **best seller** (most sold item) by looping through the HashMap
4. Build an **`ArrayList<String>`** of items that were sold **more than once**
5. Print the best seller and the popular items list

Note: if two items tie for best seller, either one is fine.

**Output**

```text
Sword: 3
Shield: 1
Potion: 3
Armor: 1
Best seller: Sword
Popular items: [Sword, Potion]
```
