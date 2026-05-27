Combine **ArrayList**, **ArrayList loops**, **HashMap**, and **HashMap loops**

---

Build an **inventory tracker**. You have a list of items sold:

```java
public class Main {
    public static void main(String[] args) {
        String[] sales = {"Sword", "Shield", "Potion", "Sword", "Potion", "Potion", "Armor", "Sword"};
    }
}
```

Do the following:

1. Build a **HashMap<String, Integer>** counting how many of each item was sold
2. Loop through the HashMap and print each item with its count
3. Find the **best seller** (most sold item) by looping through the HashMap
4. Build an **ArrayList<String>** of items that were sold **more than once**
5. Print the best seller and the popular items list

Expected output (HashMap order may vary, so we'll check key parts)

```text
Sword: 3
Shield: 1
Potion: 3
Armor: 1
Best seller: Sword
Popular items: [Sword, Potion]
```

Note: if two items tie for best seller, either one is fine
