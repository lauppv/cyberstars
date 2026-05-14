In Vice City, not everyone gets access to everything. Tommy's safe room is private — random pedestrians can't walk in. The front door of the Malibu Club is public. Java works the same way with **scope** and **access modifiers**

---

## Local Scope

Variables declared inside a method only exist inside that method. They're **local** — born when the method runs, destroyed when it ends:

```java
public class Main {
    public static void main(String[] args) {
        int x = 10;
        if (x > 5) {
            int y = 20;
            System.out.println(x + y);  // 30 — both x and y are visible here
        }
        // System.out.println(y);  // ERROR! y doesn't exist outside the if block
        System.out.println(x);     // fine — x is in the method scope
    }
}
```
Output
```text
30
10
```

Variables live in the **block** (the `{ }` braces) where they're declared. Once you exit that block, they're gone

---

## Class Scope (Fields)

Fields declared in a class exist as long as the object exists. All methods in the class can see them:

```java
class Player {
    String name;    // class scope — visible to all methods
    int health;

    Player(String name) {
        this.name = name;
        this.health = 100;
    }

    void takeDamage(int amount) {
        health -= amount;    // can access health — it's a class field
    }

    void showStatus() {
        System.out.println(name + ": " + health + " HP");  // can access both
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player("Tommy Vercetti");
        p.takeDamage(30);
        p.showStatus();
    }
}
```
Output
```text
Tommy Vercetti: 70 HP
```

---

## Access Modifiers: public vs private

You've seen `private` in the getters/setters lesson. Here's the full picture:

- **`public`** — anyone can access this. Any class, any package, anywhere
- **`private`** — only code **inside this class** can access it. Nobody else
- **`protected`** — accessible within the class and by subclasses (we'll cover inheritance later)
- **no modifier** (default) — accessible within the same package

For now, focus on `public` and `private`. They're what you'll use 99% of the time:

```java
class Vault {
    public String owner;       // anyone can see who owns it
    private int secretCode;    // only the Vault class can access this
    private int money;         // only the Vault class can touch the money

    Vault(String owner, int code, int money) {
        this.owner = owner;
        this.secretCode = code;
        this.money = money;
    }

    public boolean unlock(int code) {
        return code == secretCode;   // private field used inside the class
    }

    public int getMoney() {
        return money;
    }
}

public class Main {
    public static void main(String[] args) {
        Vault v = new Vault("Cortez", 1234, 50000);
        System.out.println("Owner: " + v.owner);       // OK — public
        // System.out.println(v.secretCode);            // ERROR — private!
        // System.out.println(v.money);                 // ERROR — private!
        System.out.println("Unlocked: " + v.unlock(1234));
        System.out.println("Money: " + v.getMoney());
    }
}
```
Output
```text
Owner: Cortez
Unlocked: true
Money: 50000
```

---

## The Standard Pattern

In well-written Java code, the pattern is:

1. Fields are **`private`** — nobody touches them directly
2. Methods are **`public`** — they provide controlled access
3. The constructor is **`public`** — so people can actually create objects

```java
class Wallet {
    private int money;

    public Wallet(int money) {
        this.money = money;
    }

    public void addMoney(int amount) {
        if (amount > 0) {
            money += amount;
        }
    }

    public void spendMoney(int amount) {
        if (amount > 0 && amount <= money) {
            money -= amount;
        }
    }

    public int getBalance() {
        return money;
    }
}
```

This keeps your data safe. Nobody can set `money` to -999 because they have to go through your methods, which have validation

---

## Local Variables Are Always "Private"

One more thing: local variables (inside methods) don't use access modifiers at all. They're automatically invisible outside their method — no keyword needed:

```java
void doStuff() {
    int temp = 42;          // no public/private — it's local
    // temp only exists inside doStuff()
}
```

Access modifiers (`public`, `private`) are only for class members — fields, methods, and constructors

---

## Exercise

Create a `Wallet` class with:
- A `private int money` field
- A constructor that takes starting money
- A `public void addMoney(int amount)` method (only if amount > 0)
- A `public void spendMoney(int amount)` method (only if amount > 0 and amount <= money)
- A `public int getBalance()` method

In `main`, create a wallet with 100, add 50, spend 30, try to spend 200 (should fail), and print the balance

Expected output:
```text
120
```
