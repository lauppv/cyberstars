So far, we've been accessing fields directly — `player.name`, `player.score`. That works, but it's like leaving your front door wide open. Anyone can walk in and change anything

In real Java code, we **hide** fields and control access through methods. This concept is called **encapsulation**

---

## The Problem with Public Fields

```java
class BankAccount {
    int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        acc.balance = -999999;  // Uh oh. Nobody stopped us
        System.out.println(acc.balance);
    }
}
```

Output

```text
-999999
```

Phil Cassidy could just waltz in and set his bank balance to whatever he wants. That's bad. We need a bouncer at the door

---

## Private Fields + Getters and Setters

The `private` keyword means "only code inside this class can touch this field":

```java
class BankAccount {
    private int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }

    int getBalance() {
        return balance;
    }

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    void withdraw(int amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        acc.deposit(500);
        acc.withdraw(200);
        // acc.balance = -999999;  // ERROR! balance is private
        System.out.println("Balance: " + acc.getBalance());
    }
}
```

Output

```text
Balance: 1300
```

Now the only way to change the balance is through `deposit()` and `withdraw()`, which have **validation** built in. Negative deposits? Ignored. Withdrawing more than you have? Nope

---

## Getter and Setter Pattern

The standard Java pattern:

- **Getter**: a method that returns a private field's value. Named `getFieldName()`
- **Setter**: a method that sets a private field's value (with validation). Named `setFieldName()`

```java
class Player {
    private String name;
    private int health;

    Player(String name, int health) {
        this.name = name;
        this.health = health;
    }

    String getName() {
        return name;
    }

    int getHealth() {
        return health;
    }

    void setHealth(int health) {
        if (health >= 0 && health <= 100) {
            this.health = health;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player("Tommy Vercetti", 100);
        p.setHealth(75);
        System.out.println(p.getName() + ": " + p.getHealth() + " HP");
        p.setHealth(-50);  // Ignored! Invalid value
        System.out.println(p.getName() + ": " + p.getHealth() + " HP");
    }
}
```

Output

```text
Tommy Vercetti: 75 HP
Tommy Vercetti: 75 HP
```

The `setHealth(-50)` call was silently ignored because our setter rejects negative values. That's the power of encapsulation — you control the rules

---

## Python Comparison

Python uses `@property` decorators for the same idea, but it's optional. In Java, making fields `private` and providing getters/setters is the standard way to write classes. You'll see this pattern everywhere

```python
# Python property (optional)
class Player:
    @property
    def health(self):
        return self._health
```

In Java, it's always explicit methods: `getHealth()`, `setHealth()`

---

## When to Skip Setters

Not every field needs a setter. Sometimes a field should be set once (in the constructor) and never changed. If `name` shouldn't change after creation, just don't write `setName()` — problem solved

The getter still lets people **read** the name, but nobody can change it. This is a common and good pattern

---

## Mission: Station Credit Vault

The station's credit vault needs a secure transaction system. Crew members can deposit and withdraw credits, but the system must reject invalid operations — no negative deposits and no overdrafts allowed.

Create a `BankAccount` class with:

1. A `private int balance` field
2. A constructor that takes the starting balance
3. A `getBalance()` method that returns the balance
4. A `deposit(int amount)` method that adds to balance (only if amount > 0)
5. A `withdraw(int amount)` method that subtracts from balance (only if amount > 0 and amount <= balance)

In `main`, create an account with `1000` credits, deposit `500`, withdraw `200`, then try to withdraw `2000` (should fail silently), and print the final balance.

**Input** (already set in your code — change the values to test):

- `1000` — starting balance
- `500` — deposit amount
- `200`, `2000` — withdrawal amounts

**Example**

With the starter values, your program should print

```text
1300
```
