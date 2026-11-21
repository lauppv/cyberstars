Every class you write has a parent, even when you don't write `extends`. Java quietly makes it extend a class called **Object**. Object sits at the top of every family tree, so every object in Java is also an Object

---

Because of that, every object has a few methods from the start, even an empty class:

- `toString()`, a text for the object
- `equals(other)`, is it equal to another object?
- `hashCode()`, a number used by HashMap and friends
- `getClass()`, which class the object really is

```java
class Car {
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        System.out.println(car.getClass().getSimpleName());
        System.out.println(car.equals(car));
    }
}
```

Output

```text
Car
true
```

`Car` declares no methods at all, and yet `getClass` and `equals` work. They come from Object

---

The `toString` you get from Object isn't very useful: the class name, an `@`, and a number in hex, something like `Car@7a81197d`. That is why you override it, as you did in the toString() lesson. When you write `println(car)` or `"text" + car`, Java calls the object's `toString()` for you

---

Since every object is an Object, a variable of type `Object` can hold anything: a String, a Car, a number

```java
public class Main {
    public static void main(String[] args) {
        Object[] box = { "Tommy", 42, 3.5 };
        for (Object item : box) {
            System.out.println(item.getClass().getSimpleName() + " " + item);
        }
    }
}
```

Output

```text
String Tommy
Integer 42
Double 3.5
```

A number can't sit in an Object variable directly, so Java wraps it in an object for you: `42` becomes an `Integer`, `3.5` becomes a `Double`. You will learn more about these in the Wrapper Classes lesson

---

There is a price: through an `Object` variable you can only call Object's methods. To use what the real class has, check its type with `instanceof` and cast it, as you did with Driver and CrewMember

```java
public class Main {
    public static void main(String[] args) {
        Object[] box = { "Tommy", 42, "Lance" };
        int letters = 0;
        for (Object item : box) {
            if (item instanceof String) {
                String text = (String) item;
                letters += text.length();
            }
        }
        System.out.println(letters);
    }
}
```

Output

```text
10
```

---

## Mission: Evidence Locker

The police seized a box of evidence from one of Tommy's warehouses: some items are labels, some are numbers, all mixed together. Store them in an `Object` array named `evidence`.

1. For every item, print `<class name>: <item>`, with the class name from `getClass().getSimpleName()`
2. Then print `Text items: N`, how many items are Strings
3. Then print `Number sum: N`, the sum of all the items that are Integers. Use `instanceof` and a cast

**Example** for `evidence = { "knife", 3, "photo", 10 }`

```text
String: knife
Integer: 3
String: photo
Integer: 10
Text items: 2
Number sum: 13
```

**Example** for `evidence = { 7 }`

```text
Integer: 7
Text items: 0
Number sum: 7
```
