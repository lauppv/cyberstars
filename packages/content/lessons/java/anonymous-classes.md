Sometimes you need an object that implements an interface just once, in one spot. Writing a whole named class for it feels like too much. An **anonymous class** lets you write the class and create its object in the same breath, right where you need it

---

Here is an interface, and a normal named class that implements it

```java
interface Greeter {
    String greet(String name);
}

class Polite implements Greeter {
    public String greet(String name) {
        return "Good evening, " + name;
    }
}

public class Main {
    public static void main(String[] args) {
        Greeter g = new Polite();
        System.out.println(g.greet("Tommy"));
    }
}
```

Output

```text
Good evening, Tommy
```

---

And here is the same idea with an anonymous class. After `new Greeter()` comes the body of the class, in `{ }`. It has no name, it is used once

```java
interface Greeter {
    String greet(String name);
}

public class Main {
    public static void main(String[] args) {
        Greeter rude = new Greeter() {
            public String greet(String name) {
                return "What do you want, " + name + "?";
            }
        };
        System.out.println(rude.greet("Lance"));
    }
}
```

Output

```text
What do you want, Lance?
```

Watch the end: `};`. The `}` closes the class body, and the `;` ends the line `Greeter rude = ...`

---

An anonymous class can use the local variables around it, as long as they never change after they get their value

```java
interface Greeter {
    String greet(String name);
}

public class Main {
    public static void main(String[] args) {
        String club = "Malibu";
        Greeter doorman = new Greeter() {
            public String greet(String name) {
                return "Welcome to the " + club + ", " + name;
            }
        };
        System.out.println(doorman.greet("Ken"));
    }
}
```

Output

```text
Welcome to the Malibu, Ken
```

If you wrote `club = "Pole Position";` later in main, Java would refuse to compile. A variable that never changes is called **effectively final**

---

Anonymous classes work with abstract classes too: `new Vehicle() { ... }` fills in the abstract methods on the spot. They are handy for small, one-time behaviour. When the same class is needed in several places, give it a name

---

## Mission: Two Deals

The Malibu Club runs two deals tonight. Write an interface `Discount` with one method, `int apply(int price)`.

In `main`, store the price in an `int` named `price` and a coupon value in an `int` named `coupon`. Create two `Discount` objects, each with an anonymous class:

- `half` gives back half the price, with no decimals
- `minus` gives back the price minus the coupon, but never less than 0

Print `Half: N`, then `Coupon: N`, then `Best: N`, the lower of the two prices.

**Example** for `price = 90` and `coupon = 20`

```text
Half: 45
Coupon: 70
Best: 45
```

**Example** for `price = 30` and `coupon = 50`

```text
Half: 15
Coupon: 0
Best: 0
```
