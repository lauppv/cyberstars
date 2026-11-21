Many classes only carry data: a point has an x and a y, a sale has an item and a price. For them you keep writing the same things: fields, a constructor, getters, toString, equals, hashCode. A **record** writes all of that for you in one line

---

```java
record Point(int x, int y) {
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p.x());
        System.out.println(p.y());
        System.out.println(p);
    }
}
```

Output

```text
3
4
Point[x=3, y=4]
```

From `record Point(int x, int y)` Java makes:

- two private, final fields, `x` and `y`
- a constructor that takes them in that order
- a method for each one, named like the field: `p.x()`, not `p.getX()`
- a `toString` that shows the name and all the values

---

It also makes `equals` and `hashCode`, comparing every field. Two records with the same values are equal, and they work as HashMap keys right away

```java
record Point(int x, int y) {
}

public class Main {
    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        System.out.println(a.equals(b));
        System.out.println(a == b);
    }
}
```

Output

```text
true
false
```

---

A record can't be changed after it is made: its fields are final, and there are no setters. To "move" a point, you make a new one

You can still add your own methods inside the braces

```java
record Sale(String item, int price, int quantity) {
    int total() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Sale s = new Sale("Pistol", 100, 3);
        System.out.println(s.item() + ": " + s.total());
    }
}
```

Output

```text
Pistol: 300
```

Use a record when the object is just its data. Use a class when the object has to change over time, like a bank account whose balance goes up and down

---

## Mission: Sales Book

Tommy keeps a book of the night's sales at Ammu-Nation. Write a record `Sale` with a `String item`, an `int price` and an `int quantity`, and give it a method `total()` that gives back price times quantity.

Store the items in a `String` array named `items`, the prices in an `int` array named `prices` and the quantities in an `int` array named `quantities`, in the same order. Make a `Sale` for each one and print it as `<the sale> -> <its total>`, letting the record's own toString write the sale. Then print `Night total: N`.

**Example** for `items = { "Pistol", "Shotgun" }`, `prices = { 100, 450 }` and `quantities = { 3, 1 }`

```text
Sale[item=Pistol, price=100, quantity=3] -> 300
Sale[item=Shotgun, price=450, quantity=1] -> 450
Night total: 750
```

**Example** for `items = { "Knife" }`, `prices = { 20 }` and `quantities = { 0 }`

```text
Sale[item=Knife, price=20, quantity=0] -> 0
Night total: 0
```
