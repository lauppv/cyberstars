In this project we build the station's bank: accounts that take money in and give money out, and refuse what they can't do with a clear reason. It brings together classes, methods, `__str__`, your own exceptions and `try` with `else`

---

First the errors. Every bank problem is a `BankError`. Two kinds have a class of their own: an amount that isn't positive, and not enough money. The second one remembers how much is missing

```py
class BankError(Exception):
    pass

class InvalidAmount(BankError):
    pass

class NotEnoughMoney(BankError):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing

print(NotEnoughMoney(30))
print(NotEnoughMoney(30).missing)
```

Output

```text
short by 30
30
```

---

Next the account. It starts empty, and every change goes through a method, so the rules live in one place. A method checks first, and only changes the balance when everything is fine

```py
class BankError(Exception):
    pass

class InvalidAmount(BankError):
    pass

class NotEnoughMoney(BankError):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing

class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        if amount > self.balance:
            raise NotEnoughMoney(amount - self.balance)
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}: {self.balance}"

ada = Account("Ada")
ada.deposit(100)
ada.withdraw(30)
print(ada)
```

Output

```text
Ada: 70
```

The methods don't print anything. They change the account, or they raise an error. What to show the user is the job of the code that calls them

---

Now that code. It tries each operation and reacts to what happened: `except` for each kind of problem, `else` when it worked

```py
class BankError(Exception):
    pass

class NotEnoughMoney(BankError):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing

class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def withdraw(self, amount):
        if amount > self.balance:
            raise NotEnoughMoney(amount - self.balance)
        self.balance -= amount

ada = Account("Ada")
for amount in [20, 0]:
    try:
        ada.withdraw(amount)
    except NotEnoughMoney as e:
        print(f"withdraw {amount}: {e}")
    else:
        print(f"withdraw {amount}: ok")
```

Output

```text
withdraw 20: short by 20
withdraw 0: ok
```

---

Last, the commands come from the keyboard, one on each line, until the word `end`. A `while True` loop reads them, and `break` stops it

```py
while True:
    line = input()
    if line == "end":
        break
    word, number = line.split()
    print(word, int(number) * 2)
```

Type `deposit 50`, then `end`, to try it

---

## Mission: Station Bank

Write the bank and let a crew member use their account from the keyboard

1. Write the classes **BankError**, **InvalidAmount** and **NotEnoughMoney** as above, and the class **Account** with `deposit()`, `withdraw()` and `__str__`
2. Read the owner's name, then commands until a line that says `end`. A command is `deposit` or `withdraw`, a space and a whole number
3. For each command, print the command, `: ` and `ok` when it worked, or the error's message when it raised a `BankError`
4. At the end, print the account as its `__str__` shows it, then `Done: ` and how many commands worked, a `/` and how many commands there were

Amounts are from -100 to 10,000, and there are from 0 to 20 commands

**Input**

```text
Ada
deposit 100
withdraw 130
deposit 0
withdraw 40
end
```

**Output**

```text
deposit 100: ok
withdraw 130: short by 30
deposit 0: amount must be positive
withdraw 40: ok
Ada: 60
Done: 2/4
```
