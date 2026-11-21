An object holds data, and it can also do things. A function written inside a class is a **method**. We've used methods for a long time, like `name.upper()` or `crew.append()`. Now we write our own

---

A method looks like `__init__`: it sits in the class and its first parameter is `self`, the object it was called on. Through `self` it reads and changes that object's attributes

```py
class Counter:
    def __init__(self):
        self.count = 0

    def add(self):
        self.count += 1

clicks = Counter()
clicks.add()
clicks.add()
print(clicks.count)
```

Output

```text
2
```

`clicks.add()` runs `add` with `clicks` as `self`. As with `__init__`, we never pass `self` ourselves

---

Methods can take more values and give back a result, like any function

```py
class Wallet:
    def __init__(self, money):
        self.money = money

    def pay(self, price):
        if price > self.money:
            return False
        self.money -= price
        return True

wallet = Wallet(10)
print(wallet.pay(4), wallet.money)
print(wallet.pay(20), wallet.money)
```

Output

```text
True 6
False 6
```

The method keeps the rule in one place: nobody can spend more than the wallet has, as long as they pay through `pay()`

---

Each object has its own data, so the same method works on each one separately. And one method can call another one through `self`

```py
class Wallet:
    def __init__(self, money):
        self.money = money

    def pay(self, price):
        if price > self.money:
            return False
        self.money -= price
        return True

    def pay_twice(self, price):
        return self.pay(price) and self.pay(price)

ada = Wallet(10)
alan = Wallet(3)
print(ada.pay_twice(4), ada.money)
print(alan.pay_twice(2), alan.money)
```

Output

```text
True 2
False 1
```

Alan's first payment works, the second doesn't: `and` stops at the first False

---

## Mission: Fuel Tank

A ship's tank holds fuel up to its capacity. Pilots fill it and use it, and the tank must never go over its capacity or below empty

1. Write a class **Tank** with an `__init__` that takes a `capacity` and starts with `fuel` at 0, and three methods:
   - **fill(amount)** adds as much of the amount as fits, and returns how much it really added
   - **use(amount)** takes the amount out if there is enough fuel and returns True, or changes nothing and returns False
   - **percent()** returns how full the tank is, in percent, as a whole number rounded down. Multiply by 100 before you divide: `29 / 100 * 100` gives `28.999999999999996`, not 29
2. Start your program with two variables: **capacity**, a whole number, and **actions**, a list of strings like `"fill 50"` or `"use 20"`. For example `capacity = 80` and `actions = ["fill 50", "use 20", "fill 70", "use 100"]`
3. For each action, call the method and print the action, `: ` and what the method returned
4. Print `Full: `, the percent and `%`

**capacity** is from 1 to 1000, and each amount from 0 to 1000

**Example** for the values above

```text
fill 50: 50
use 20: True
fill 70: 50
use 100: False
Full: 100%
```
