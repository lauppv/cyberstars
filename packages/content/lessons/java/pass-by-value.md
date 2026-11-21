When you pass a variable to a method, what does the method get: the variable itself, or a copy? Java has one simple rule, but it surprises almost everyone the first time. Java always passes a **copy of the value**

---

With a primitive like `int`, the copy is the number itself. Changing it inside the method doesn't touch the caller's variable

```java
public class Main {
    static void addBonus(int cash) {
        cash = cash + 100;
        System.out.println("Inside: " + cash);
    }

    public static void main(String[] args) {
        int cash = 50;
        addBonus(cash);
        System.out.println("Outside: " + cash);
    }
}
```

Output

```text
Inside: 150
Outside: 50
```

The method got its own `cash`, a copy of 50. It changed its copy. The `cash` in main never moved

---

With an object, the variable doesn't hold the object. It holds a **reference**: an address that says where the object lives. The method gets a copy of that address. Both addresses lead to the same object, so the method can change the object

```java
class Wallet {
    int cash;
}

public class Main {
    static void addBonus(Wallet w) {
        w.cash = w.cash + 100;
    }

    public static void main(String[] args) {
        Wallet tommy = new Wallet();
        tommy.cash = 50;
        addBonus(tommy);
        System.out.println(tommy.cash);
    }
}
```

Output

```text
150
```

Arrays work the same way. A method that changes `array[0]` changes the caller's array, because they share it

---

But the method only has a copy of the address. If it points its copy at a new object, the caller doesn't see that

```java
class Wallet {
    int cash;
}

public class Main {
    static void swapWallet(Wallet w) {
        w = new Wallet();
        w.cash = 9999;
    }

    public static void main(String[] args) {
        Wallet tommy = new Wallet();
        tommy.cash = 50;
        swapWallet(tommy);
        System.out.println(tommy.cash);
    }
}
```

Output

```text
50
```

`w = new Wallet()` changes where the method's copy points. Tommy's variable still points at his old wallet, with 50 in it

---

So, in short:

- a method can't change the caller's `int`, `double`, `boolean`, `char` variables
- a method can change what is inside an object or an array it receives
- a method can't make the caller's variable point at another object. If it wants to give a new value back, it uses `return`

Strings are objects, but they can't be changed at all, so a method can never change the caller's String

---

## Mission: Two Kinds of Raise

Tommy gives his crew a raise, and wants to see which way of writing it really works. Write a class `Member` with a `String name` and an `int pay`.

Write two methods next to `main`:

* `raisePay(int pay, int amount)` adds the amount to its `pay` parameter and gives nothing back
* `raiseMember(Member m, int amount)` adds the amount to the member's pay

In `main`, store the member's name in a `String` named `name`, the pay in an `int` named `pay` and the raise in an `int` named `amount`. Create the member, then:

1. Call `raisePay` with the `pay` variable and print `After raisePay: <pay>`
2. Call `raiseMember` with the member and print `After raiseMember: <name> earns <the member's pay>`

**Example** for `name = "Lance"`, `pay = 500` and `amount = 100`

```text
After raisePay: 500
After raiseMember: Lance earns 600
```

**Example** for `name = "Ken"`, `pay = 0` and `amount = 75`

```text
After raisePay: 0
After raiseMember: Ken earns 75
```
