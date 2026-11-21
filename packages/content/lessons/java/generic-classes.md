`ArrayList<String>` holds Strings, `ArrayList<Integer>` holds Integers, and it is the same ArrayList class. How? ArrayList is a **generic class**: it has a type parameter, a blank that you fill with a type when you use it. You can write classes like that too

---

Here is a box that can hold one thing of any type. `T` is the blank

```java
class Box<T> {
    T item;

    Box(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<String> note = new Box<>("Meet at the Malibu");
        Box<Integer> cash = new Box<>(5000);

        String text = note.get();
        int amount = cash.get() + 100;
        System.out.println(text);
        System.out.println(amount);
    }
}
```

Output

```text
Meet at the Malibu
5100
```

Inside the class, `T` stands for "the type someone will choose". In `Box<String>` every `T` becomes `String`, in `Box<Integer>` it becomes `Integer`. The `<>` on the right lets Java copy the type from the left side

---

Why not just use `Object` for the item? Because then Java forgets the real type. You'd need a cast every time you take something out, and a wrong cast would only crash when the program runs. With a type parameter, Java checks it while compiling

```java
class Box<T> {
    T item;

    Box(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<String> note = new Box<>("hello");
        // int n = note.get();   // won't compile: a String is not an int
        System.out.println(note.get().toUpperCase());
    }
}
```

Output

```text
HELLO
```

Type parameters must be objects, so you write `Box<Integer>`, never `Box<int>`. The wrapper classes make that easy

---

A class can have more than one type parameter. By habit they get short, capital names: `T` for type, `K` and `V` for key and value, `A` and `B` for a first and a second thing

```java
class Labeled<K, V> {
    K label;
    V value;

    Labeled(K label, V value) {
        this.label = label;
        this.value = value;
    }

    public String toString() {
        return label + " = " + value;
    }
}

public class Main {
    public static void main(String[] args) {
        Labeled<String, Double> rate = new Labeled<>("tax", 0.2);
        System.out.println(rate);
    }
}
```

Output

```text
tax = 0.2
```

This is exactly how `HashMap<K, V>` is built

---

## Mission: Pairs

Write a generic class `Pair<A, B>` that holds two values of two types. Give it:

- methods `first()` and `second()` that give the values back
- a method `swap()` that gives back a new `Pair<B, A>`, with the two values the other way round
- a `toString()` that gives back `(<first>, <second>)`

In `main`, store a name in a `String` named `name` and a score in an `int` named `score`. Make a `Pair<String, Integer>` from them and print it, then print its swap. Last, print `<name> has <score> points`, taking the two values out of the pair with `first()` and `second()`.

**Example** for `name = "Tommy"` and `score = 120`

```text
(Tommy, 120)
(120, Tommy)
Tommy has 120 points
```

**Example** for `name = "Ken"` and `score = 0`

```text
(Ken, 0)
(0, Ken)
Ken has 0 points
```
